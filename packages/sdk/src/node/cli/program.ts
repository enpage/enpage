#!/usr/bin/env node
import { program } from "commander";
import {
  startDevServer,
  buildTemplate,
  previewTemplate,
  type ArgOpts,
  type CommonOptions,
} from "./cli-methods";
import createServer from "~/server/node/server";

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
  )
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
