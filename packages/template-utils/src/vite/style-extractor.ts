import { Plugin, Root, Result, Rule, AtRule, Comment } from "postcss";
import fs from "fs";
import path from "path";

interface StyleExtractorOptions {
  output: "json" | "css";
  manifestFile: string;
}

interface StyleObject {
  [selector: string]: {
    [property: string]:
      | string
      | {
          [mediaQuery: string]: string;
        };
  };
}

/**
 * Extracts styles from CSS and normalizes them into a consistent format.
 * @param options - Plugin options
 * @returns PostCSS Plugin
 */
const styleExtractor = (
  options: StyleExtractorOptions = { output: "json", manifestFile: "style-manifest.json" },
): Plugin => {
  return {
    postcssPlugin: "style-extractor",
    Once(root: Root, { result }: { result: Result }): void {
      const styles: StyleObject = {};

      const processRule = (rule: Rule, media: string | null = null): void => {
        let selector: string = rule.selector;

        // Handle nested rules (e.g., from SCSS)
        if (rule.parent && rule.parent.type === "rule") {
          selector = `${(rule.parent as Rule).selector} ${selector}`;
        }

        if (!styles[selector]) {
          styles[selector] = {};
        }

        rule.walkDecls((decl) => {
          if (media) {
            if (typeof styles[selector][media] !== "object") {
              styles[selector][media] = {};
            }
            (styles[selector][media] as { [key: string]: string })[decl.prop] = decl.value;
          } else {
            styles[selector][decl.prop] = decl.value;
          }
        });
      };

      root.walkRules((rule) => {
        if (rule.parent && rule.parent.type === "atrule" && (rule.parent as AtRule).name === "media") {
          processRule(rule, (rule.parent as AtRule).params);
        } else {
          processRule(rule);
        }
      });

      if (options.output === "json") {
        // Output as JSON file
        const manifestPath = path.resolve(result.opts.to ? path.dirname(result.opts.to) : ".", options.manifestFile);
        fs.writeFileSync(manifestPath, JSON.stringify(styles, null, 2));
        console.log(`Style manifest written to: ${manifestPath}`);

        // Also add as a comment in CSS for reference
        root.after(new Comment({ text: `STYLE_MANIFEST: See ${options.manifestFile} for the full style manifest` }));
      } else if (options.output === "css") {
        // Output as CSS custom properties
        const newRoot = new Root();
        Object.entries(styles).forEach(([selector, properties]) => {
          const rule = new Rule({ selector });
          Object.entries(properties).forEach(([prop, value]) => {
            if (typeof value === "object") {
              // Handle media queries
              const mediaRule = new AtRule({ name: "media", params: prop });
              const nestedRule = new Rule({ selector });
              Object.entries(value).forEach(([mediaProp, mediaValue]) => {
                nestedRule.append({ prop: `--${mediaProp}`, value: mediaValue });
              });
              mediaRule.append(nestedRule);
              newRoot.append(mediaRule);
            } else {
              rule.append({ prop: `--${prop}`, value });
            }
          });
          newRoot.append(rule);
        });
        root.after(newRoot);
      }
    },
  };
};

styleExtractor.postcss = true;

export default styleExtractor;
