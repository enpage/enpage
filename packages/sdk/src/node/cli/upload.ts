import { connect, type ClientHttp2Session, type ClientHttp2Stream } from "node:http2";
import path from "node:path";
import { createReadStream } from "node:fs";
import fg from "fast-glob";
import { API_BASE_URL, DEFAULT_UPLOAD_MAX_CONCURRENCY } from "./constants";

export interface UploadResult {
  hasUploadErrors: boolean;
  filesCount: number;
  uploadedFiles: number;
  filesWithError: string[];
}

interface QueueTask {
  task: () => Promise<void>;
  resolve: (value: void | PromiseLike<void>) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  reject: (reason?: any) => void;
}

export class UploadQueue {
  private concurrency: number;
  private queue: QueueTask[];
  private active: number;

  constructor(concurrency = DEFAULT_UPLOAD_MAX_CONCURRENCY) {
    this.concurrency = concurrency;
    this.queue = [];
    this.active = 0;
  }

  add(task: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  private async run(): Promise<void> {
    if (this.active >= this.concurrency || this.queue.length === 0) return;

    this.active++;
    const { task, resolve, reject } = this.queue.shift()!;

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.active--;
      this.run();
    }
  }
}

export async function uploadFiles(templateId: string, token: string): Promise<UploadResult> {
  const session: ClientHttp2Session = connect(API_BASE_URL);
  const basePath = path.resolve(process.cwd(), ".enpage", "dist");

  const uploadQueue = new UploadQueue(DEFAULT_UPLOAD_MAX_CONCURRENCY); // Adjust concurrency as needed

  let hasUploadErrors = false;
  let filesCount = 0;
  let uploadedFiles = 0;
  const filesWithError: string[] = [];

  const files = await fg("**/*", {
    cwd: basePath,
    onlyFiles: true,
    dot: true,
  });

  filesCount = files.length;

  const uploadTasks = files.map((entry) => async () => {
    return new Promise<void>((resolve, reject) => {
      console.log(`  Uploading ${entry}...`);
      const file = createReadStream(path.resolve(basePath, entry));
      const req: ClientHttp2Stream = session.request({
        ":method": "POST",
        ":path": `/templates/${templateId}/files/${entry}`,
        "content-type": "application/octet-stream",
        Authorization: `Bearer ${token}`,
      });

      req.on("response", (headers) => {
        if (headers[":status"] === 200) {
          console.log(`  Uploaded ${entry}`);
          uploadedFiles++;
          resolve();
        } else {
          console.error(`  Error uploading ${entry}: ${headers[":status"]} ${headers[":status-text"] ?? ""}`);
          hasUploadErrors = true;
          filesWithError.push(entry);
          reject(new Error(`Failed to upload ${entry}`));
        }
      });

      req.on("error", (err: Error) => {
        console.error(`  Error uploading ${entry}: ${err.message}`);
        hasUploadErrors = true;
        filesWithError.push(entry);
        reject(err);
      });

      file.pipe(req);
    });
  });

  try {
    await Promise.allSettled(uploadTasks.map((task) => uploadQueue.add(task)));
  } catch (error) {
    // This will catch any upload errors, but we've already logged them
  }

  session.close();

  console.log(`\nUploaded ${uploadedFiles} out of ${filesCount} files\n`);
  if (hasUploadErrors) {
    console.error(`Failed to upload ${filesWithError.length} files:\n  - ${filesWithError.join("\n  - ")}`);
  }

  return { hasUploadErrors, filesCount, uploadedFiles, filesWithError };
}
