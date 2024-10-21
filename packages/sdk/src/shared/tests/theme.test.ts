import { describe, it, expect } from "vitest";
import { defineCustomThemes } from "../theme";

describe("Theme test suite", () => {
  describe("defineCustomThemes", () => {
    it("should define a custom theme", () => {
      const [theme] = defineCustomThemes({
        name: "Dark",
        description: "A dark theme",
        colors: {
          primary: "#FF9900",
          secondary: "#333999",
          tertiary: "#666",
          neutral: "#999",
        },
        typography: {
          base: 18,
          heading: "antique",
          body: "didone",
        },
        customFonts: [
          {
            name: "Antique",
            src: "https://fonts.googleapis.com/css2?family=Antique",
            weight: "400",
          },
          {
            name: "Didone",
            src: "https://fonts.googleapis.com/css2?family=Didone",
          },
        ],
      });
      expect(theme.name).toBe("Dark");
      expect(theme.description).toBe("A dark theme");
      expect(theme.colors.primary).toBe("#FF9900");
    });
  });
});
