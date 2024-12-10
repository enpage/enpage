import { describe, it, expect } from "vitest";
import { getNewSiteConfig, type TemplateConfig } from "../page";
import testConfig from "./test-config";

describe("Page test suite", () => {
  describe("getNewSiteConfig", () => {
    it("should return a new site config", () => {
      const testConfigJson = { ...testConfig };
      const siteConfig = getNewSiteConfig(testConfigJson);
      expect(siteConfig).toBeTruthy();
    });
  });
});
