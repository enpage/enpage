import type { OptionValues } from "commander";
import type { Logger } from "../shared/logger";

export type CredentialsStore = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
  expires_at: number;
};

export type CommandArgOpts<Opts extends OptionValues = OptionValues> = {
  args: string[];
  options: CommonOptions & Opts;
  logger: Logger;
};

export type CommonOptions = {
  logLevel?: "info" | "warn" | "error" | "silent";
  clearScreen?: boolean;
  dryRun?: boolean;
};

export type BuildOptions = {
  ssr: boolean | "local";
  clean?: boolean;
};

export type GenericApiError = {
  error: string;
  error_description: string;
};
