import type { GenericPageConfig } from "~/shared/page-config";
import type { Options } from "../../types";

export interface HttpJsonOptions extends Options {
  url: string;
  headers?: Record<string, string>;
  pageConfig: GenericPageConfig;
}
