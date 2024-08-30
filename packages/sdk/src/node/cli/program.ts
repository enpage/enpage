#!/usr/bin/env node
import { program, Argument, type Command, type OptionValues } from "commander";
import type { ArgOpts, BuildOptions, CommonOptions } from "./types";
import { publish } from "./commands/publish/cmd-publish";
import { login } from "./commands/login/cmd-login";
import { preview } from "./commands/preview/cmd-preview";
import { buildTemplate } from "./commands/build/cmd-build";
import { startDevServer } from "./commands/dev/cmd-dev";
import { createLogger } from "../shared/logger";
import { logout } from "./commands/logout/cmd-logout";

program
  .name("enpage")
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`)
  .option("--dry-run", `[boolean] run command without making changes`)
  .hook("preAction", (thisCommand) => {
    createLogger(thisCommand.opts().logLevel, thisCommand.opts().clearScreen, true);
  });

program
  .command("dev")
  .description("Start Enpage development server")
  .action(function (this: Command) {
    startDevServer(getArgsOptionsObject(this));
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
  .action(function (this: Command) {
    buildTemplate(getArgsOptionsObject<BuildOptions>(this));
  });

program
  .command("publish")
  .description("Publish a template to Enpage")
  .argument("[directory]", "Directory to publish")
  .option("--no-check", `Don't check for required files`)

  .action(function (this: Command) {
    publish(getArgsOptionsObject(this));
  });

program
  .command("preview")
  .description("Preview Enpage template using production-like server")
  .action(function (this: Command) {
    preview(getArgsOptionsObject(this));
  });

program
  .command("login")
  .description("Login to Enpage")
  .action(function (this: Command) {
    login(getArgsOptionsObject(this));
  });

program
  .command("logout")
  .description("Logout from Enpage")
  .action(function (this: Command) {
    logout(getArgsOptionsObject(this));
  });

program.parse();

function getArgsOptionsObject<O extends OptionValues>(cmd: Command) {
  return { options: cmd.opts<CommonOptions & O>(), args: cmd.args };
}
