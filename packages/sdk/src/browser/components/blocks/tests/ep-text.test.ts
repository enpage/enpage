// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { TextBlock, register, defaults } from "../ep-text";

function stripLineBreaks(str: string) {
  return str.replace(/[\n\r]/g, "");
}

describe("Component: ep-text", () => {
  describe("Client-side rendering", () => {
    beforeAll(() => {
      // we need to manually register the element for the tests
      register();
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("should render in the DOM", () => {
      const element = document.createElement("ep-text");
      document.body.appendChild(element);
      expect(document.body.contains(element)).toBe(true);
    });

    it("should have default content", () => {
      const element = document.createElement("ep-text");
      document.body.appendChild(element);
      expect(element.content).toBe(defaults.props.content);
    });

    it("should update content when attribute is set", () => {
      const element = document.createElement("ep-text");
      element.content = "New content";
      document.body.appendChild(element);
      expect(element.content).toBe("New content");
    });

    it("should be able to render independently of the DOM", () => {
      const element = new TextBlock();
      element.content = "# I'm a markdown";
      element.setAttribute("format", "markdown");
      const html = element.render();
      expect(stripLineBreaks(html)).toBe(
        "<ep-text format=\"markdown\"><template># I'm a markdown</template><h1>I'm a markdown</h1></ep-text>",
      );
    });

    it("should update format when attribute is set", () => {
      const element = document.createElement("ep-text");
      element.setAttribute("format", "markdown");
      element.content = "My content";
      document.body.appendChild(element);
      expect(element.format).toBe("markdown");
      // expect(document.getElementsByTagName("ep-text")[0].innerHTML).toBe("My content");
    });

    it("should render plain text in its textContent", () => {
      const element = document.createElement("ep-text");
      element.content = "Test content";
      document.body.appendChild(element);
      expect(element.shadowRoot).toBeNull();
      const contentDiv = document.querySelector("ep-text");
      expect(contentDiv?.textContent).toBe("Test content");
    });

    it("should hanlde markdown format", () => {
      const element = document.createElement("ep-text");
      element.content = "# Test content";
      element.setAttribute("format", "markdown");
      document.body.appendChild(element);
      const contentDiv = document.querySelector("ep-text")?.children.item(1);
      expect(contentDiv?.outerHTML).toBe("<h1>Test content</h1>");
    });

    it("should handle plain text format", () => {
      const element = document.createElement("ep-text");
      element.content = "Test content";
      element.setAttribute("format", "plain");
      document.body.appendChild(element);

      const contentDiv = document.querySelector("ep-text");
      expect(contentDiv?.innerText).toBe("Test content");
      expect(contentDiv?.innerHTML).toBe("Test content");
    });

    it("should handle html format", () => {
      const element = document.createElement("ep-text");
      element.content = "<strong>Test content</strong>";
      element.setAttribute("format", "html");
      document.body.appendChild(element);
      const contentDiv = document.querySelector("ep-text");
      expect(contentDiv?.innerHTML).toBe("<strong>Test content</strong>");
    });

    it("should sanitize markdown content", () => {
      const element = document.createElement("ep-text");
      // image with javascript
      element.content = "![bad](javascript:alert(1)) ![good](https://ex.com)";
      element.setAttribute("format", "markdown");
      document.body.appendChild(element);
      const contentDiv = document.querySelector("ep-text")?.children.item(1);
      expect(contentDiv?.outerHTML).toBe('<p><img alt="bad"> <img alt="good" src="https://ex.com"></p>');
    });

    it("should sanitize html content", () => {
      const element = document.createElement("ep-text");
      // image with javascript
      element.content = '<img src="javascript:alert(1)"> <img src="https://ex.com">';
      element.setAttribute("format", "html");
      document.body.appendChild(element);
      const contentDiv = document.querySelector("ep-text");
      expect(contentDiv?.innerHTML).toBe('<img> <img src="https://ex.com">');
    });

    it("should have an ID when created", () => {
      const element = document.createElement("ep-text");
      document.body.appendChild(element);
      expect(element.getAttribute("id")).toBeTruthy();
    });
  });
});
