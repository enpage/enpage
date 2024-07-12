#!/usr/bin/env node
import { program } from "commander";
import { startDevServer, buildTemplate, previewTemplate } from "./cli-methods";

program
  .command("dev")
  .description("Start Enpage development server")
  .action(() => {
    startDevServer();
  });

program
  .command("build")
  .description("Build Enpage teplate")
  .action(() => {
    buildTemplate();
  });

program
  .command("preview")
  .description("Preview Enpage template")
  .action(() => {
    previewTemplate();
  });

program.parse();
