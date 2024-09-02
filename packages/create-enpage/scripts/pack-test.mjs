#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

// Function to get the most recently created .tgz file
async function getMostRecentTgzFile(directory) {
  const files = await fs.readdir(directory);
  const tgzFiles = await Promise.all(
    files
      .filter((file) => file.endsWith(".tgz"))
      .map(async (file) => {
        const stats = await fs.stat(path.join(directory, file));
        return { name: file, time: stats.mtime.getTime() };
      }),
  );

  tgzFiles.sort((a, b) => b.time - a.time);
  return tgzFiles.length > 0 ? tgzFiles[0].name : null;
}

// Get the directory where the script is located
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
// Parent directory of the script (should be the package root)
const packageDir = path.dirname(scriptDir);

async function main() {
  try {
    // Run pnpm pack
    console.log("\nRunning pnpm pack...");
    execSync("pnpm pack", { cwd: packageDir, stdio: "inherit" });

    // Find the most recently created .tgz file
    const tgzFile = await getMostRecentTgzFile(packageDir);

    if (tgzFile) {
      const oldPath = path.join(packageDir, tgzFile);
      const newPath = path.join(packageDir, "create-enpage-test.tgz");

      // remove old file if it exists
      if (await fileExists(newPath)) {
        await fs.unlink(newPath);
      }

      // Rename the file
      await fs.rename(oldPath, newPath);
      console.log(`renamed to create-enpage-test.tgz\n`);

      console.log(chalk.cyan(`create-enpage-test.tgz is ready to test\n`));
    } else {
      console.error("No .tgz file found after running pnpm pack");
      process.exit(1);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

main();
