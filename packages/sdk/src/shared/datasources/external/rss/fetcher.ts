import type { RssOptions } from "./options";
import { parseFeed } from "htmlparser2";
import type { DatasourceFetcher } from "../../types";
import { type RssSchema, rssSchema } from "./schema";
import { ajv, serializeAjvErrors } from "~/shared/ajv";

const fetchRss: DatasourceFetcher<RssSchema, null, RssOptions> = async ({ options }) => {
  const { url } = options;
  const content = await (await fetch(url)).text();
  const feed = parseFeed(content);

  const newFeed: RssSchema = {
    ...feed,
    link: feed?.link ?? "",
    title: feed?.title ?? "",
    updated: feed?.updated ? feed.updated.toISOString() : undefined,
    items:
      feed?.items.map((item) => ({
        ...item,
        pubDate: item.pubDate ? item.pubDate.toISOString() : new Date().toISOString(),
      })) ?? [],
  };

  const validate = ajv.compile<RssSchema>(rssSchema);
  const isValid = validate(newFeed);

  if (!isValid) {
    throw new Error(`fetchRss Error: Invalid Feed data (${url}): ${serializeAjvErrors(validate.errors)}`);
  }

  return newFeed;
};

export default fetchRss;
