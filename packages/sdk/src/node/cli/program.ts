#!/usr/bin/env node
import { program } from "commander";
import {
  startDevServer,
  buildTemplate,
  previewTemplate,
  type ArgOpts,
  type CommonOptions,
} from "./cli-methods";

program
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`);

program
  .command("dev")
  .description("Start Enpage development server")
  .action((...args) => {
    startDevServer(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });
program
  .command("build")
  .description("Build Enpage teplate")
  .option("--ssr", `[boolean] enable server side rendering`)
  .action((...args) => {
    buildTemplate(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });
program
  .command("preview")
  .description("Preview Enpage template")
  .action((...args) => {
    previewTemplate(getArgsOptions(args) as ArgOpts<CommonOptions>);
  });

program.parse();

function getArgsOptions(args: unknown[]) {
  const options = args.at(-2);
  const commandArgs = args.slice(0, -2);
  return { options, args: commandArgs };
}
