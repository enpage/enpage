import type { RssOptions } from "./options";
import Parser from "rss-parser";
import type { DatasourceFetcher } from "../types";
import type { RssSchema } from "./schema";
import { ajv, serializeAjvErrors } from "~/shared/ajv";

const fetchRss: DatasourceFetcher<RssSchema, null, RssOptions> = async ({ options }) => {
  const parser: Parser = new Parser();
  const { url } = options;

  const feed = (await parser.parseURL(url)) as RssSchema;

  const validate = ajv.compile<RssSchema>(feed);
  const isValid = validate(feed);

  if (!isValid) {
    throw new Error(`fetchRss Error: Invalid Feed data (${url}): ${serializeAjvErrors(validate.errors)}`);
  }

  return feed;
};

export default fetchRss;
