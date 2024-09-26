import { describe, it, expect } from "vitest";
import {
  defineTokens,
  defineTheme,
  defineComponents,
  generateCSSVariables,
  analyzeTokenUsage,
  token,
  type TokensMap,
  type Theme,
} from "../styles"; // Adjust this import path as needed

describe("Design System Functions", () => {
  describe("defineTokens", () => {
    it("should merge custom tokens with default tokens", () => {
      const customTokens: TokensMap = {
        customColor: token.color("Custom Color", "#ff0000"),
      };
      const themes = {
        mytheme: defineTheme(customTokens, {
          default: { $primaryColor: "#0070f3" },
        }),
      };
      const result = defineTokens(customTokens);
      expect(result).toHaveProperty("customColor");
      expect(result).toHaveProperty("$primaryColor"); // Assuming this is a default token

      expect(() => generateCSSVariables(result, themes)).not.toThrow();

      console.log("generated CSS variables", generateCSSVariables(result, themes));
    });

    it("should throw an error if custom token name starts with $", () => {
      const invalidTokens: TokensMap = {
        $invalidToken: token.color("Invalid Token", "#000000"),
      };
      expect(() => defineTokens(invalidTokens)).toThrow();
    });
  });

  describe("default tokens", () => {
    it("should contain default tokens", () => {
      const tokens = defineTokens({});
      console.dir(tokens);
      expect(tokens).toHaveProperty("$primaryColor");
      expect(tokens).toHaveProperty("$secondaryColor");
      expect(tokens).toHaveProperty("$backgroundColor");
      expect(tokens).toHaveProperty("$textColor");
      expect(tokens).toHaveProperty("$fontBody");
      expect(tokens).toHaveProperty("$fontHeading");
    });
  });

  describe("defineTheme", () => {
    it("should return the provided theme object", () => {
      const customTokens: TokensMap = {
        customColor: token.color("Custom Color", "#ff0000"),
      };
      const theme = {
        default: { color: "#000000" },
        light: { color: "#ffffff" },
        dark: { color: "#333333" },
      };
      const result = defineTheme(customTokens, theme);
      expect(result).toEqual(theme);

      expect(() => generateCSSVariables({}, { default: theme })).not.toThrow();
    });
  });

  //describe("defineComponents", () => {
  //   it("should resolve component tokens", () => {
  //     const tokens = {
  //       primaryColor: "#0070f3",
  //       fontSize: "16px",
  //     };
  //     const components = {
  //       Button: {
  //         backgroundColor: "primaryColor",
  //         fontSize: "fontSize",
  //       },
  //     };
  //     const result = defineComponents(tokens, components);
  //     expect(result).toEqual({
  //       Button: {
  //         backgroundColor: "#0070f3",
  //         fontSize: "16px",
  //       },
  //     });
  //   });
  // });

  describe("generateCSSVariables", () => {
    it("should generate CSS variables for tokens and themes", () => {
      const tokens: TokensMap = {
        $primaryColor: token.color("Primary Color", "#0070f3"),
      };
      const themes = {
        default: {
          default: { $primaryColor: "#0070f3" },
          light: { $primaryColor: "#3291ff" },
          dark: { $primaryColor: "#0761d1" },
        },
      };
      const result = generateCSSVariables(tokens, themes);
      expect(result).toContain(":root");
      expect(result).toContain('[data-theme="default"]');
      expect(result).toContain("(prefers-color-scheme: light)");
      expect(result).toContain("(prefers-color-scheme: dark)");
    });
  });

  describe("analyzeTokenUsage", () => {
    it("should correctly categorize default and custom tokens", () => {
      const tokens: TokensMap = {
        $defaultToken: token.color("Default Token", "#000000"),
        customToken: token.color("Custom Token", "#ffffff"),
      };
      const result = analyzeTokenUsage(tokens);
      expect(result.usedDefaults).toContain("$defaultToken");
      expect(result.customized).toContain("customToken");
    });
  });

  describe("token helpers", () => {
    it("should create correct token objects", () => {
      expect(token.color("Test Color", "#ff0000")).toEqual({
        type: "color",
        name: "Test Color",
        value: "#ff0000",
      });

      expect(token.fontFamily("Test Typography", "Arial, sans-serif")).toEqual({
        type: "font-family",
        name: "Test Typography",
        value: "Arial, sans-serif",
      });

      // Add more tests for other token types...
    });
  });
});
