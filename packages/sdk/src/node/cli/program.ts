#!/usr/bin/env node
import { program } from "commander";
import open from "open";
import {
  startDevServer,
  buildTemplate,
  previewTemplate,
  type ArgOpts,
  type CommonOptions,
  submitTemplate,
  login,
} from "./cli-methods";
import { nanoid } from "nanoid";

program
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`);

program
  .command("dev")
  .description("Start Enpage development server")
  .action((...args) => {
    startDevServer(getArgsOptions(args) as ArgOpts<CommonOptions>);
    // createServer().listen(process.env.PORT || 3000);
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
  .command("submit")
  .description("Submit template to Enpage")
  .action(async (...args) => {
    submitTemplate(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program
  .command("preview")
  .description("Preview Enpage template using production-like server")
  .action((...args) => {
    previewTemplate(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program
  .command("login")
  .description("Login to Enpage")
  .action(async (...args) => {
    login(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program.parse();

function getArgsOptions(args: unknown[]) {
  const options = args.at(-2);
  const commandArgs = args.slice(0, -2);
  return { options, args: commandArgs };
}
