#!/usr/bin/env node

import degit from "degit";
import { program } from "commander";
import { resolve } from "node:path";
import path from "node:path";
import chalk from "chalk";
import { existsSync, mkdirSync, lstatSync, readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { input, select } from "@inquirer/prompts";
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
      mkdirSync(directory, { recursive: true });
      console.log(chalk.cyan("OK"));
    } else if (!lstatSync(directory).isDirectory()) {
      console.log(chalk.red(`${directory} exists but is not a directory. Aborting.`));
      process.exit(1);
    } else if (!isDirectoryEmpty(directory)) {
      console.log(chalk.red(`Directory ${directory} is not empty. Aborting.`));
      process.exit(1);
    }
    process.stdout.write("Cloning template example... ");

    await degit("enpage/enpage/packages/template-example", { cache: false }).clone(directory);

    // remove CHANGELOG.md
    rmSync(resolve(directory, "CHANGELOG.md"));

    console.log(chalk.cyan("OK"));
    console.log("");
    console.log("Let's set up your new template:");

    const name = await input({
      message: "Name your template",
      validate(value) {
        if (value.length > 0) {
          return true;
        }
        return "Name cannot be empty";
      },
    });

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

    const visibility = await select({
      message: "Choose the visibility of the template",
      choices: [
        { name: "Private", value: "private", description: "For your eyes only" },
        {
          name: "Public",
          value: "public",
          description: "To be available on Enpage (paid or free users)",
        },
      ],
    });

    if (visibility === "public") {
      console.log("  > You will need to publish your template to make it available on Enpage.\n");
    }

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

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const pkgPath = resolve(directory, "package.json");
    const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));

    // replace all references to "workspace:" in all kind of dependencies with "latest"
    // for (const depType of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    //   if (pkgJson[depType]) {
    //     for (const [dep, version] of Object.entries<string>(pkgJson[depType])) {
    //       if (version.startsWith("workspace:")) {
    //         pkgJson[depType][dep] = "latest";
    //       }
    //     }
    //   }
    // }

    // name needs to be valid for registries, so we generate a new one
    pkgJson.name = `enpage-template-${path.basename(directory)}`;
    pkgJson.author = author;
    pkgJson.keywords = [...new Set([...pkgJson.keywords, ...tagsArray])];

    pkgJson.license = "UNLICENSED";

    pkgJson.homepage = homepage.length > 0 ? homepage : undefined;
    pkgJson.enpage = {
      name,
      description,
    };

    if (visibility === "private") {
      pkgJson.enpage.private = true;
      pkgJson.private = true;
    }

    // biome-ignore lint/performance/noDelete: need to remove the lint script
    delete pkgJson.scripts.lint;
    // biome-ignore lint/performance/noDelete: need to remove the ci:lint script
    delete pkgJson.scripts["ci:lint"];

    // write the package.json
    process.stdout.write("Writing package.json... ");
    writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
    console.log(chalk.cyan("OK"));

    // install dependencies
    console.log("Installing dependencies... ");

    const pm = getPackageManager();

    execSync(`${pm} install`, { cwd: directory, stdio: "inherit" });

    console.log(`\n${chalk.cyan("All done!")}\n`);
    console.log("You can now develop your template:\n");
    console.log(chalk.cyan(`  cd ${dir}`));
    console.log(chalk.cyan(`  ${runCmd} dev\n`));

    process.exit(0);
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
