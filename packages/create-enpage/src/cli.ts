#!/usr/bin/env node

import degit from "degit";
import { program } from "commander";
import { resolve } from "node:path";
import path from "node:path";
import chalk from "chalk";
import { existsSync, mkdirSync, lstatSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { input } from "@inquirer/prompts";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";

program
  .description("Create a new Enpage template")
  .argument("[directory]", "Directory to create the template in", ".")
  .action(async (dir) => {
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
      console.log(chalk.red(`Directory ${directory} is not empty. Aborting.`));
      process.exit(1);
    }
    process.stdout.write("Cloning template example... ");

    const emitter = degit("enpage/enpage/packages/template-example");

    await emitter.clone(directory);
    console.log(chalk.blue("OK"));

    console.log("");
    console.log("Let's set up your new template:");

    const description = await input({
      message: "Enter a template description",
      validate(value) {
        if (value.length > 0) {
          return true;
        }
        return "Description cannot be empty";
      },
    });
    const author = await input({
      message: "Enter the author's name",
      validate(value) {
        if (value.length > 0) {
          return true;
        }
        return "Author name cannot be empty";
      },
    });
    // ask for tags
    const tags = await input({ message: "Enter tags for the template (optional, comma separated)" });
    const homepage = await input({
      message: "Enter a homepage URL (optional)",
      validate(value) {
        if (value.length === 0) {
          return true;
        }
        try {
          new URL(value);
          return true;
        } catch (e) {}
        return "Homepage URL must start with https://";
      },
    });

    const template = {
      id: randomUUID(),
    };

    const tagsArray = tags.split(",").map((tag: string) => tag.trim());
    const pkgPath = resolve(directory, "package.json");
    const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));

    // replace all references to "workspace:" in all kind of dependencies with "latest"
    for (const depType of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
      if (pkgJson[depType]) {
        for (const [dep, version] of Object.entries<string>(pkgJson[depType])) {
          if (version.startsWith("workspace:")) {
            pkgJson[depType][dep] = "latest";
          }
        }
      }
    }

    pkgJson.name = `enpage-template-${path.basename(directory)}`;
    pkgJson.enpage = template;
    pkgJson.author = author;
    pkgJson.keywords = [...new Set([...pkgJson.keywords, ...tagsArray])];
    pkgJson.license = "UNLICENSED";
    pkgJson.description = description;
    pkgJson.homepage = homepage.length > 0 ? homepage : undefined;

    // write the package.json
    process.stdout.write("Writing package.json... ");
    writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
    console.log(chalk.blue("OK"));

    // install dependencies
    console.log("Installing dependencies... ");

    const pm = getPackageManager();
    execSync(`${pm} install`, { cwd: directory });

    console.log(chalk.blue("All done!"));
    console.log("\n\nYou can now develop your template:\n");
    console.log(chalk.blue(`   cd ${directory}`));
    console.log(chalk.blue(`   ${pm} start`));
  });

program.parse();

function isDirectoryEmpty(path: string) {
  const files = readdirSync(path);
  return files.length === 0;
}

function getPackageManager() {
  // Detect package manager
  let packageManager: string | undefined;
  if (process.env.npm_config_user_agent) {
    const pmPart = process.env.npm_config_user_agent.split(" ")[0];
    packageManager = pmPart.slice(0, pmPart.lastIndexOf("/"));
  }

  // Display message
  if (!packageManager) {
    console.log("Warning: could not detect package manager");
    packageManager = "npm";
  }

  return packageManager;
}
