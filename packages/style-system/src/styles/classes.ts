import { kebabCase } from "./utils";
import { tokenNameToCSSVar, type TokensMap } from "./tokens";

/**
 * Generates utility classes based on the defined tokens
 */
export function generateUtilityClasses(tokens: TokensMap): string {
  let css = "";

  for (const [key, token] of Object.entries(tokens)) {
    switch (token.type) {
      case "color":
        css += `.text-${kebabCase(key)} { color: var(${tokenNameToCSSVar(key)}); }\n`;
        css += `.bg-${kebabCase(key)} { background-color: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-family":
        css += `.${kebabCase(key)} { font-family: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-size":
        css += `.${kebabCase(key).replace("font-size-", "text-")} { font-size: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "font-weight":
        css += `.${kebabCase(key)} { font-weight: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "border-radius":
        css += `.${kebabCase(key)} { border-radius: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "border-style":
        css += `.${kebabCase(key)} { border-style: var(${tokenNameToCSSVar(key)}); }\n`;
        break;
      case "border-width":
        css += `.${kebabCase(key)} { border-width: var(${tokenNameToCSSVar(key)}); }\n`;
        css += `.${kebabCase(key).replace("border-", "bl-")} { border-left-width: var(${tokenNameToCSSVar(key)}); }\n`;
        css += `.${kebabCase(key).replace("border-", "bt-")} { border-top-width: var(${tokenNameToCSSVar(key)}); }\n`;
        css += `.${kebabCase(key).replace("border-", "br-")} { border-right-width: var(${tokenNameToCSSVar(key)}); }\n`;
        css += `.${kebabCase(key).replace("border-", "bb-")} { border-bottom-width: var(${tokenNameToCSSVar(key)}); }\n`;
        break;

      case "line-height":
        css += `.${kebabCase(key)} { line-height: var(${tokenNameToCSSVar(key)}); }\n`;
        break;

      case "spacing":
        // padding, margin
        css += `.p-${key.substring(8)} { padding: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.pt-${key.substring(8)} { padding-top: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.pr-${key.substring(8)} { padding-right: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.pb-${key.substring(8)} { padding-bottom: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.pl-${key.substring(8)} { padding-left: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.px-${key.substring(8)} { padding-left: var(${tokenNameToCSSVar(key)}); padding-right: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.py-${key.substring(8)} { padding-top: var(${tokenNameToCSSVar(key)}); padding-bottom: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.p-inline-${key.substring(8)} { padding-inline: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.p-block-${key.substring(8)} { padding-block: var(${tokenNameToCSSVar(key)});  }\n`;

        css += `.m-${key.substring(8)} { margin: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.mt-${key.substring(8)} { margin-top: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.mr-${key.substring(8)} { margin-right: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.mb-${key.substring(8)} { margin-bottom: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.ml-${key.substring(8)} { margin-left: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.mx-${key.substring(8)} { margin-left: var(${tokenNameToCSSVar(key)}); margin-right: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.my-${key.substring(8)} { margin-top: var(${tokenNameToCSSVar(key)}); margin-bottom: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.m-inline-${key.substring(8)} { margin-inline: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.m-block-${key.substring(8)} { margin-block: var(${tokenNameToCSSVar(key)});  }\n`;
        break;

      case "size":
        // width, height
        css += `.w-${key.substring(5)} { width: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.h-${key.substring(5)} { height: var(${tokenNameToCSSVar(key)});  }\n`;

        // min-width, min-height
        css += `.min-w-${key.substring(5)} { min-width: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.min-h-${key.substring(5)} { min-height: var(${tokenNameToCSSVar(key)});  }\n`;

        // max-width, max-height
        css += `.max-w-${key.substring(5)} { max-width: var(${tokenNameToCSSVar(key)});  }\n`;
        css += `.max-h-${key.substring(5)} { max-height: var(${tokenNameToCSSVar(key)});  }\n`;
        break;
    }
  }

  return css;
}
