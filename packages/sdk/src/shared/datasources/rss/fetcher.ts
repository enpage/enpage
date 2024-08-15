import type { RssOptions } from "./types";
import Parser from "rss-parser";
import Ajv from "ajv";
import type { DatasourceFetcher } from "../types";
import type { RssSchema } from "./schema";

const fetchRss: DatasourceFetcher<RssSchema, null, RssOptions> = async ({ options }) => {
  const parser: Parser = new Parser();
  const url = options.url;

  const feed = (await parser.parseURL(url)) as RssSchema;

  const ajv = new Ajv();
  const validate = ajv.compile<RssSchema>(feed);
  const isValid = validate(feed);

  if (!isValid) {
    throw new Error(`fecthRss Error: Invalid Feed (${url}): ${validate.errors}`);
  }

  return feed;
};

export default fetchRss;
