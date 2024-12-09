import { describe, it, expect } from "vitest";
import { getNewSiteConfig, type TemplateConfig } from "../page";
import testConfig from "./test-config";
import { FromSchema } from "../utils/schema";
import test from "node:test";

describe("Page test suite", () => {
  describe("getNewSiteConfig", () => {
    it("should return a new site config", () => {
      const testConfigJson = { ...testConfig };
      // @ts-ignore
      testConfigJson.attributes = FromSchema(testConfigJson.attributes);
      const siteConfig = getNewSiteConfig(testConfigJson);
      expect(siteConfig).toBeTruthy();
    });
  });
});
