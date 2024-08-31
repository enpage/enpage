import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { post, get } from "../api";
import { accessStore } from "../store";

vi.mock("../store", () => ({
  accessStore: {
    get: vi.fn(),
  },
  getToken: vi.fn(),
}));

vi.mock("../shared/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

global.fetch = vi.fn();

describe("API functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("post", () => {
    it("should make a POST request with correct headers and body", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(mockResponse),
      });

      const result = await post("/test", { key: "value" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ key: "value" }),
        }),
      );
      expect(result).toEqual({
        isSuccess: true,
        isError: false,
        status: 200,
        statusText: "OK",
        data: mockResponse,
      });
    });

    it("should handle URLSearchParams correctly", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(mockResponse),
      });

      const params = new URLSearchParams({ key: "value" });
      await post("/test", params);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
          body: params,
        }),
      );
    });

    it("should handle error responses", async () => {
      const errorResponse = { error: "Test error" };
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(errorResponse),
      });

      const result = await post("/test", { key: "value" });

      expect(result).toEqual({
        isSuccess: false,
        isError: true,
        status: 400,
        statusText: "Bad Request",
        data: errorResponse,
      });
    });
  });

  describe("get", () => {
    it("should make a GET request with correct headers", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(mockResponse),
      });

      vi.mocked(accessStore.get).mockReturnValue("test-token");

      const result = await get("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        }),
      );
      expect(result).toEqual({
        isSuccess: true,
        isError: false,
        status: 200,
        statusText: "OK",
        data: mockResponse,
      });
    });

    it("should handle error responses", async () => {
      const errorResponse = { error: "Test error" };
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve(errorResponse),
      });

      const result = await get("/test");

      expect(result).toEqual({
        isSuccess: false,
        isError: true,
        status: 404,
        statusText: "Not Found",
        data: errorResponse,
      });
    });
  });
});
