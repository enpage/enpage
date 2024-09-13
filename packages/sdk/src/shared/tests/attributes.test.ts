import { describe, it, expect } from "vitest";
import { attr, defineAttributes } from "../attributes";

describe("Attributes test suite", () => {
  describe("defineAttributes", () => {
    it("should define default attributes", () => {
      const attributes = defineAttributes({
        name: attr.string("Name"),
        age: attr.number("Age"),
        isStudent: attr.boolean("Is Student"),
        createdAt: attr.date("Created At"),
      });
      expect(attributes.id).toBe("attributes");
      expect(attributes.type).toBe("object");
      expect(attributes.properties).toBeTypeOf("object");
      expect(attributes.properties).toHaveProperty("$siteLanguage");
      expect(attributes.properties).toHaveProperty("$siteTitle");
      expect(attributes.properties).toHaveProperty("$siteDescription");
      expect(attributes.properties).toHaveProperty("$siteKeywords");
      expect(attributes.properties).toHaveProperty("$siteLastUpdated");
      expect(attributes.properties).toHaveProperty("name");
      expect(attributes.properties).toHaveProperty("age");
      expect(attributes.properties).toHaveProperty("isStudent");
      expect(attributes.properties).toHaveProperty("createdAt");
    });
  });
});
