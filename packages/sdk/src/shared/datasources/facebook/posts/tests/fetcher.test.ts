import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchFacebookPostDatasource from "../fetcher";
import { Http401Error } from "../../../errors";
import type { MetaOAuthConfig } from "../../../meta/oauth/config";
import type { MetaOptions } from "../../../meta/options";
import type { DatasourceFetcherParams } from "../../../types";

// Mock the fetch function
global.fetch = vi.fn();

describe("fetchFacebookPostDatasource", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch Facebook posts successfully", async () => {
    const mockResponse = {
      data: [
        {
          object_id: "123",
          id: "123",
          message: "Test post",
          from: { name: "Test User", id: "456" },
          permalink_url: "https://facebook.com/post/123",
          link: "https://facebook.com/post/123",
          is_hidden: false,
          is_published: true,
          type: "status",
          status_type: "mobile_status_update",
          actions: [{ name: "Comment", link: "https://facebook.com/post/123" }],
        },
      ],
      paging: { next: "https://graph.facebook.com/me/posts?after=123" },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchFacebookPostDatasource({
      options: { limit: 10 },
      oauth: { config: { accessToken: "test-token" } },
      pageConfig: {},
    } as DatasourceFetcherParams<MetaOAuthConfig, MetaOptions>);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://graph.facebook.com/me/posts?"),
    );
  });

  it("should throw Http401Error on unauthorized response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(
      fetchFacebookPostDatasource({
        options: { limit: 10 },
        oauth: { config: { accessToken: "invalid-token" } },
        pageConfig: {},
      } as DatasourceFetcherParams<MetaOAuthConfig, MetaOptions>),
    ).rejects.toThrow(Http401Error);
  });

  it("should throw error on invalid response data", async () => {
    const invalidResponse = { invalid: "data" };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
    });

    await expect(
      fetchFacebookPostDatasource({
        options: { limit: 10 },
        oauth: { config: { accessToken: "test-token" } },
        pageConfig: {},
      } as DatasourceFetcherParams<MetaOAuthConfig, MetaOptions>),
    ).rejects.toThrow();
  });
});
