import type { Options } from "../../types";

export interface TiktokVideoOptions extends Options {
  body?: {
    maxCount?: number;
  };
}
