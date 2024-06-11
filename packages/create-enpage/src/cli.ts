#!/usr/bin/env node
import degit from "degit";
import { program } from "commander";
import { resolve } from "path";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import { existsSync, mkdirSync, lstatSync, readdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

program
  .description("Create a new Enpage template")
  .argument("[directory]", "Directory to create the template in", ".")
  .action((dir) => {
    const directory = resolve(process.cwd(), dir);
    const exist = existsSync(directory);
    if (!exist) {
      // create the directory
      process.stdout.write(`Creating directory ${directory}... `);
      mkdirSync(directory);
      console.log(chalk.blue("OK"));
    } else if (!lstatSync(directory).isDirectory()) {
      console.log(chalk.red(`${directory} exists but is not a directory. Aborting.`));
      process.exit(1);
    } else if (!isDirectoryEmpty(directory)) {
      console.log(chalk.red(`Directory ${directory} already exists and is not empty. Aborting.`));
      process.exit(1);
    }
    process.stdout.write("Cloning template example... ");

    const emitter = degit("FlippableSoft/enpage-sdk/packages/template-example", {
      cache: true,
      force: true,
      verbose: false,
      mode: "tar",
    });

    emitter.clone(directory).then(() => {
      console.log(chalk.blue("OK"));
    });
  });

program.parse();

function isDirectoryEmpty(path: string) {
  const files = readdirSync(path);
  return files.length === 0;
}
