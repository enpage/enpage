#!/usr/bin/env node
import { program } from "commander";
import type { ArgOpts, CommonOptions } from "./types";
import { publish } from "./commands/publish/cmd-publish";
import { login } from "./commands/login/cmd-login";
import { preview } from "./commands/preview/cmd-preview";
import { buildTemplate } from "./commands/build/cmd-build";
import { startDevServer } from "./commands/dev/cmd-dev";
import { createLogger } from "../shared/logger";

program
  .name("enpage")
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`)
  .hook("preAction", (thisCommand) => {
    createLogger(thisCommand.opts().logLevel, thisCommand.opts().clearScreen, true);
  });

program
  .command("dev")
  .description("Start Enpage development server")
  .action((...args) => {
    startDevServer(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program
  .command("build")
  .description("Build template")
  .option(
    "--ssr [type]",
    `Enable server side rendering.
Pass --ssr to generate a SSR-enabled build.
Pass --ssr=local to generate a SSR-enabled build that can be tested locally.`,
    true,
  )
  .option("--no-clean", `Don't clean directory before buidling`)
  .action((...args) => {
    buildTemplate(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program
  .command("publish")
  .description("Publish a template to Enpage")
  .action(async (...args) => {
    publish(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program
  .command("preview")
  .description("Preview Enpage template using production-like server")
  .action((...args) => {
    preview(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program
  .command("login")
  .description("Login to Enpage")
  .action((...args) => {
    login(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program.parse();

function getArgsOptions(args: unknown[]) {
  const options = args.at(-2);
  const commandArgs = args.slice(0, -2);
  return { options, args: commandArgs };
}
