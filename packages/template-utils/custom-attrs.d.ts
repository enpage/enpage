export {};
declare global {
  type Boolish = boolean | "true" | "false" | "1" | "0" | "yes" | "no";

  interface HTMLElement {
    "data-appear-animation"?: string;
    "data-appear-animation-duration"?: string;
    "data-hover-animation"?: string;
    "data-hover-animation-duration"?: string;
    /**
     * Label for the element. Will be displayed to the user.
     * If not provided, the element "id" will be used.
     */
    "data-enpage-label"?: string;
    /**
     * A Boolean value indicating whether or not the direct children of the element can be **reordered**.
     */
    "data-enpage-allow-reorder"?: Boolish;

    /**
     * A Boolean value indicating whether or not the element can be **duplicated**.
     */
    "data-enpage-allow-duplicate"?: Boolish;

    /**
     * A Boolean value indicating whether or not the element can be **deleted**.
     */
    "data-enpage-allow-delete"?: Boolish;

    /**
     * The type of the element. When not specified, the default value is "element".
     *
     * - A value of "page" indicates that the element is the uppermost container of the page.
     * - A value of "element" indicates that the element is a regular element.
     * - A value of "container" indicates that the element is a container.
     */
    "data-enpage-type"?: "page" | "element" | "container";

    /**
     * **Enpage custom attribute**
     *
     * A Boolean value indicating whether or not the content of the element can be edited.
     * When set to "plain-text", the content will be plain text. When set to "html", the content will be HTML.
     * When set to true, the content will be plain text.
     */
    "data-enpage-content-editable"?: "plain-text" | "html" | boolean;

    /**
     * **Enpage custom attribute**
     *
     * Commas separated list of style properties that can be edited.
     * When set to "all", all style properties can be edited.
     * When set to "none", no style properties can be edited.
     * When set to "default", the default style properties can be edited depending on the block type.
     */
    "data-style-props"?: string;
  }
}
