import { defineNormalize } from "../normalize";
import { defaultTokens } from "./default-tokens";

export const defaultNormalize = defineNormalize(defaultTokens, {
  "*, *::before, *::after": {
    "box-sizing": "border-box",
  },
  html: {
    "font-size": "16px",
    "line-height": "var(--line-height-normal)",
    "-webkit-text-size-adjust": "100%",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  body: {
    margin: 0,
    "font-family": "var(--font-humanist)",
    color: "$gray-950",
    "background-color": "$white",
  },
  "h1, h2, h3, h4, h5, h6": {
    "margin-top": 0,
    "margin-bottom": "var(--spacing-sm)",
    "font-weight": "var(--font-weight-bold)",
    "line-height": "var(--line-height-tight)",
  },
  p: {
    "margin-top": 0,
    "margin-bottom": "var(--spacing-md)",
    "line-height": "var(--line-height-normal)",
  },
  a: {
    color: "var(--blue-600)",
    "text-decoration": "none",
    ":hover": {
      "text-decoration": "underline",
    },
  },
  "ol, ul": {
    "margin-top": 0,
    "margin-bottom": "var(--spacing-md)",
    "padding-left": "var(--spacing-lg)",
  },
  "img, video": {
    "max-width": "100%",
    height: "auto",
  },
  "input, button, textarea, select": {
    "font-family": "inherit",
    "font-size": "inherit",
    "line-height": "inherit",
  },
  table: {
    "border-collapse": "collapse",
    width: "100%",
  },
  "thead, tbody, tr, th, td": {
    border: "1px solid var(--gray-200)",
  },
  "th, td": {
    padding: "$spacing-sm",
  },
  'button, input[type="button"], input[type="reset"], input[type="submit"]': {
    "-webkit-appearance": "none",
    appearance: "none",
    "background-color": "var(--gray-200)",
    border: "none",
    cursor: "pointer",
    display: "inline-block",
    "padding-inline": "var(--spacing-md)",
    "padding-block": "var(--spacing-sm)",
    "font-weight": "var(--font-weight-bold)",
    "line-height": "var(--line-height-normal)",
    "text-align": "center",
    "text-decoration": "none",
    "white-space": "nowrap",
    "user-select": "none",
    "vertical-align": "middle",
  },
  button: {
    ":hover": {
      "background-color": "var(--gray-300)",
    },
    ":focus": {
      outline: "2px solid var(--blue-500)",
      "outline-offset": "2px",
    },
    ":active": {
      "background-color": "var(--gray-400)",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  'input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], \
  input[type="url"], input[type="search"], input[type="date"], input[type="time"], \
  input[type="datetime-local"], input[type="month"], input[type="week"], input[type="color"], \
  input[type="file"], input[type="range"], input[type="checkbox"], input[type="radio"], select, textarea': {
    "background-color": "var(--white)",
    border: "1px solid var(--gray-200)",
    "border-radius": "var(--border-radius-md)",
    color: "var(--gray-900)",
    display: "block",
    "font-size": "var(--font-size-base)",
    "line-height": "var(--line-height-normal)",
    "padding-inline": "var(--spacing-md)",
    "padding-block": "var(--spacing-sm)",
    width: "100%",
    ":focus": {
      outline: "2px solid var(--blue-500)",
      "outline-offset": "2px",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});
