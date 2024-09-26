import { describe, it, expect, vi } from "vitest";
import { HTMLStreamParser, Node } from "../html-parser";

describe("HTMLStreamParser", () => {
  it("should parse a simple ep- tag", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write("<ep-div>Hello</ep-div>");
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-div",
      attributes: {},
      children: [{ type: "text", data: "Hello" }],
    });
  });

  it("should parse nested ep- tags", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write("<ep-outer><ep-inner>Nested</ep-inner></ep-outer>");
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-outer",
      attributes: {},
      children: [
        {
          type: "tag",
          name: "ep-inner",
          attributes: {},
          children: [{ type: "text", data: "Nested" }],
        },
      ],
    });
  });

  it("should handle attributes on ep- tags", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write('<ep-element class="test" id="myElem">With attributes</ep-element>');
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-element",
      attributes: { class: "test", id: "myElem" },
      children: [{ type: "text", data: "With attributes" }],
    });
  });

  it("should handle self-closing ep- tags", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write('<ep-img src="test.jpg" alt="Test image" />');
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-img",
      attributes: { src: "test.jpg", alt: "Test image" },
      children: [],
    });
  });

  it("should handle multiple top-level ep- nodes", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write("<ep-first>First</ep-first><ep-second>Second</ep-second>");
    parser.end();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, {
      type: "tag",
      name: "ep-first",
      attributes: {},
      children: [{ type: "text", data: "First" }],
    });
    expect(callback).toHaveBeenNthCalledWith(2, {
      type: "tag",
      name: "ep-second",
      attributes: {},
      children: [{ type: "text", data: "Second" }],
    });
  });

  it("should handle chunked input with ep- tags", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write("<ep-chunk>");
    parser.write("Chunked ");
    parser.write("input");
    parser.write("</ep-chunk>");
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-chunk",
      attributes: {},
      children: [{ type: "text", data: "Chunked input" }],
    });
  });

  it("should ignore non-ep- tags", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write("<div><p>Ignored</p><ep-custom>Parsed</ep-custom></div>");
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-custom",
      attributes: {},
      children: [{ type: "text", data: "Parsed" }],
    });
  });

  it("should ignore whitespace-only text nodes", () => {
    const callback = vi.fn();
    const parser = new HTMLStreamParser(callback);

    parser.write("<ep-whitespace>  \n  \t  </ep-whitespace>");
    parser.end();

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-whitespace",
      attributes: {},
      children: [],
    });
  });
});
