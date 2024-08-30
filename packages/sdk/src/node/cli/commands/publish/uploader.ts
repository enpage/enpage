import path from "node:path";
import fs from "node:fs";
import fg from "fast-glob";
import { API_BASE_URL, DEFAULT_UPLOAD_MAX_CONCURRENCY } from "../../constants";
import { getToken } from "../../store";
import http from "node:http";
import https from "node:https";
import { pipeline } from "node:stream";
import type { GenericApiError } from "../../types";
import { logger } from "~/node/shared/logger";
import chalk from "chalk";
import FormData from "form-data";
import parseGitIgnore from "./parse-gitignore";

interface UploadStats {
  fileName: string;
  fileSize: number;
  uploadDuration: number;
  statusCode: number;
  serverResponse: string;
}

type FileUploadError = GenericApiError & { filename: string };

interface UploadTask {
  filePath: string;
  relativePath: string;
  uploadUrl: string;
  resolve: (value: UploadStats | PromiseLike<UploadStats>) => void;
  reject: (reason?: FileUploadError) => void;
}

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 10,
  keepAliveMsecs: 3000, // Keep connections open for 3 seconds
});

class UploadQueue {
  private queue: UploadTask[];
  private active: number;

  constructor(
    protected templateId: string,
    protected token = getToken(),
    protected concurrency = DEFAULT_UPLOAD_MAX_CONCURRENCY,
  ) {
    this.queue = [];
    this.active = 0;
  }

  async add(filePath: string, relativePath: string, uploadUrl: string): Promise<UploadStats> {
    return new Promise<UploadStats>((resolve, reject) => {
      const task: UploadTask = { filePath, relativePath, uploadUrl, resolve, reject };
      this.queue.push(task);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.active >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.active++;

    try {
      const result = await this.uploadFile(task.filePath, task.relativePath, task.uploadUrl);
      task.resolve(result);
    } catch (error) {
      task.reject(error as FileUploadError);
    } finally {
      this.active--;
      this.processQueue();
    }
  }

  private uploadFile(filePath: string, relativePath: string, uploadUrl: string): Promise<UploadStats> {
    return new Promise<UploadStats>((resolve, reject) => {
      const stats = fs.statSync(filePath);
      const fileName = path.basename(filePath);
      const startTime = Date.now();

      const form = new FormData({
        maxDataSize: 12 * 1024 * 1024, // 12MB
      });
      const fileStream = fs.createReadStream(filePath);
      let totalUploaded = 0;

      const updateProgress = (chunk: Buffer) => {
        totalUploaded += chunk.length;
      };

      fileStream.on("data", updateProgress);
      form.append("file", fileStream, {
        filename: fileName,
        knownLength: stats.size,
      });

      const options: https.RequestOptions = {
        agent,
        method: "POST",
        headers: {
          authorization: `Bearer ${this.token}`,
          "x-enpage-template-file-path": relativePath,
          "x-enpage-template-id": this.templateId,
          ...form.getHeaders(),
        },
      };

      const protocol = uploadUrl.startsWith("https") ? https : http;
      const req = protocol.request(uploadUrl, options, (res) => {
        let responseBody = "";
        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          const endTime = Date.now();
          const uploadStats: UploadStats = {
            fileName,
            fileSize: stats.size,
            uploadDuration: endTime - startTime,
            statusCode: res.statusCode ?? 0,
            serverResponse: responseBody,
          };

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            logger.info(`✅ Uploaded ${relativePath}`);
            resolve(uploadStats);
          } else {
            const erroObject = res.headers["content-type"]?.startsWith("application/json")
              ? { ...JSON.parse(responseBody), filename: relativePath }
              : {
                  error: "unknown_error",
                  error_description: responseBody,
                  filename: relativePath,
                };

            logger.error(
              `❌ Failed to upload ${relativePath}: [${erroObject.error}] ${erroObject.error_description}`,
            );
            reject(erroObject);
          }
        });
      });

      req.on("error", (error) => {
        reject({
          error: "request_error",
          error_description: error.message,
          filename: relativePath,
        });
      });

      pipeline(form, req, (err) => {
        if (err) {
          reject(new Error(`Pipeline failed for ${fileName}: ${err.message}`));
        }
      });
    });
  }
}

// function uploadFile(filePath: string, relativePath: string, uploadUrl: string, templateId: string, token: string): Promise<UploadStats> {
//   return new Promise<UploadStats>((resolve, reject) => {
//     const stats = fs.statSync(filePath);
//     const fileName = path.basename(filePath);
//     const startTime = Date.now();

//     const form = new FormData({
//       maxDataSize: 12 * 1024 * 1024, // 12MB
//     });
//     const fileStream = fs.createReadStream(filePath);
//     let totalUploaded = 0;

//     const updateProgress = (chunk: Buffer) => {
//       totalUploaded += chunk.length;
//     };

//     fileStream.on("data", updateProgress);
//     form.append("file", fileStream, {
//       filename: fileName,
//       knownLength: stats.size,
//     });

//     const options: https.RequestOptions = {
//       agent,
//       method: "POST",
//       headers: {
//         authorization: `Bearer ${token}`,
//         "x-enpage-template-file-path": relativePath,
//         "x-enpage-template-id": templateId,
//         ...form.getHeaders(),
//       },
//     };

//     const protocol = uploadUrl.startsWith("https") ? https : http;
//     const req = protocol.request(uploadUrl, options, (res) => {
//       let responseBody = "";
//       res.on("data", (chunk) => {
//         responseBody += chunk;
//       });

//       res.on("end", () => {
//         const endTime = Date.now();
//         const uploadStats: UploadStats = {
//           fileName,
//           fileSize: stats.size,
//           uploadDuration: endTime - startTime,
//           statusCode: res.statusCode ?? 0,
//           serverResponse: responseBody,
//         };

//         if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
//           logger.info(`✅ Uploaded ${relativePath}`);
//           resolve(uploadStats);
//         } else {
//           const erroObject = res.headers["content-type"]?.startsWith("application/json")
//             ? { ...JSON.parse(responseBody), filename: relativePath }
//             : {
//                 error: "unknown_error",
//                 error_description: responseBody,
//                 filename: relativePath,
//               };

//           logger.error(
//             `❌ Failed to upload ${relativePath}: [${erroObject.error}] ${erroObject.error_description}`,
//           );
//           reject(erroObject);
//         }
//       });
//     });

//     req.on("error", (error) => {
//       reject({
//         error: "request_error",
//         error_description: error.message,
//         filename: relativePath,
//       });
//     });

//     pipeline(form, req, (err) => {
//       if (err) {
//         reject(new Error(`Pipeline failed for ${fileName}: ${err.message}`));
//       }
//     });
//   });
// }

export async function uploadTemplate(templateId: string, templateDir: string, token: string) {
  const uploadQueue = new UploadQueue(templateId, token); // Adjust concurrency as needed
  const gitignore = path.join(templateDir, ".gitignore");
  const gitignoreExists = fs.existsSync(gitignore);
  const gitignored = gitignoreExists ? parseGitIgnore(fs.readFileSync(gitignore, "utf-8")).patterns : [];
  const files = await fg("**/*", {
    cwd: templateDir,
    onlyFiles: true,
    dot: true,
    absolute: true,
    ignore: ["node_modules/**", ".cache/**", "**/.DS_Store", ".git/**", ".enpage/**", ...gitignored],
  });

  const filesCount = files.length;

  const uploadPromises = files.map((file) => {
    const relativePath = path.relative(templateDir, file);
    const url = `${API_BASE_URL}/v1/templates/${templateId}/upload`;
    return uploadQueue.add(path.resolve(templateDir, file), relativePath, url);
  });

  const results = await Promise.allSettled(uploadPromises);

  const uploadedFiles = results.filter(
    (result) => result.status === "fulfilled",
  ) as PromiseFulfilledResult<UploadStats>[];

  const failedFiles = results.filter((result) => result.status === "rejected") as PromiseRejectedResult[];
  logger.info(""); // Add a newline after the list of files

  if (failedFiles.length > 0) {
    logger.error(chalk.red(`Failed to upload ${failedFiles.length} files:`));
    failedFiles.forEach((failure) => {
      const error = failure.reason as FileUploadError;
      logger.error(`- ${error.filename}: ${error.error_description} (${error.error})`);
    });
  } else {
    logger.info(chalk.green(`Uploaded ${uploadedFiles.length} files successfully.\n`));
  }

  return { filesCount, uploadedFiles, failedFiles, success: failedFiles.length === 0 };
}
