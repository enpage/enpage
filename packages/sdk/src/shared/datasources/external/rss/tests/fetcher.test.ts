import { describe, expect, test } from "vitest";
import fetchRss from "../fetcher";
import type { GenericPageConfig } from "../../../../page";

describe("rssFetcher", () => {
  const feeds = [
    "https://www.apple.com/newsroom/rss-feed.rss",
    "https://www.nasa.gov/news-release/feed/",
    "https://www.nasa.gov/learning-resources/feed/",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://techcrunch.com/feed/",
  ];

  test.each(feeds)("test rssFetcher(%s)", { concurrent: true }, async (url) => {
    expect(url).toBeTypeOf("string");
    const feed = await fetchRss({
      options: {
        url: feeds[0],
      },
      oauth: null,
      // @ts-ignore
      pageConfig: {} as GenericPageConfig,
    });

    expect(feed.title).toBeTypeOf("string");
    expect(feed.link).toBeTypeOf("string");
    expect(feed.updated).toBeTypeOf("string");
    expect(feed.items.length).toBeGreaterThan(0);
    expect(feed.items[0].title).toBeTypeOf("string");
    expect(feed.items[0].link).toBeTypeOf("string");
    expect(feed.items[0].pubDate).toBeTypeOf("string");
    expect(feed.items[0].content).to.be.oneOf([undefined, "string"]);
  });
});
