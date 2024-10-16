import { describe, it, expect, vi } from "vitest";
import { Readable } from "node:stream";
import { NodeHTMLStreamParser } from "../html-parser-node";

describe("NodeHTMLStreamParser", () => {
  it("should parse a simple ep- tag", async () => {
    const callback = vi.fn();
    const parser = new NodeHTMLStreamParser(callback);

    const inputStream = new Readable({
      read() {
        this.push("<ep-div>Hello</ep-div>");
        this.push(null);
      },
    });

    await new Promise<void>((resolve) => {
      inputStream.pipe(parser);
      parser.on("finish", () => {
        expect(callback).toHaveBeenCalledWith({
          type: "tag",
          name: "ep-div",
          attributes: {},
          children: [{ type: "text", data: "Hello" }],
        });
        resolve();
      });
    });
  });

  it("should parse nested ep- tags", async () => {
    const callback = vi.fn();
    const parser = new NodeHTMLStreamParser(callback);

    const inputStream = new Readable({
      read() {
        this.push("<ep-outer><ep-inner>Nested</ep-inner></ep-outer>");
        this.push(null);
      },
    });

    await new Promise<void>((resolve) => {
      inputStream.pipe(parser);
      parser.on("finish", () => {
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
        resolve();
      });
    });
  });

  it("should handle attributes on ep- tags", async () => {
    const callback = vi.fn();
    const parser = new NodeHTMLStreamParser(callback);

    const inputStream = new Readable({
      read() {
        this.push('<ep-element class="test" id="myElem">With attributes</ep-element>');
        this.push(null);
      },
    });

    await new Promise<void>((resolve) => {
      inputStream.pipe(parser);
      parser.on("finish", () => {
        expect(callback).toHaveBeenCalledWith({
          type: "tag",
          name: "ep-element",
          attributes: { class: "test", id: "myElem" },
          children: [{ type: "text", data: "With attributes" }],
        });
        resolve();
      });
    });
  });

  it("should handle chunked input with ep- tags", async () => {
    const callback = vi.fn();
    const parser = new NodeHTMLStreamParser(callback);

    const inputStream = new Readable({
      read() {
        this.push("<ep-chunk>");
        this.push("Chunked ");
        this.push("input");
        this.push("</ep-chunk>");
        this.push(null);
      },
    });

    await new Promise<void>((resolve) => {
      inputStream.pipe(parser);
      parser.on("finish", () => {
        expect(callback).toHaveBeenCalledWith({
          type: "tag",
          name: "ep-chunk",
          attributes: {},
          children: [{ type: "text", data: "Chunked input" }],
        });
        resolve();
      });
    });
  });

  it("should ignore non-ep- tags", async () => {
    const callback = vi.fn();
    const parser = new NodeHTMLStreamParser(callback);

    const inputStream = new Readable({
      read() {
        this.push("<div><p>Ignored</p><ep-custom>Parsed</ep-custom></div>");
        this.push(null);
      },
    });

    await new Promise<void>((resolve) => {
      inputStream.pipe(parser);
      parser.on("finish", () => {
        expect(callback).toHaveBeenCalledWith({
          type: "tag",
          name: "ep-custom",
          attributes: {},
          children: [{ type: "text", data: "Parsed" }],
        });
        resolve();
      });
    });
  });

  it("should handle multiple top-level ep- nodes", async () => {
    const callback = vi.fn();
    const parser = new NodeHTMLStreamParser(callback);

    const inputStream = new Readable({
      read() {
        this.push("<ep-first>First</ep-first><ep-second>Second</ep-second>");
        this.push(null);
      },
    });

    await new Promise<void>((resolve) => {
      inputStream.pipe(parser);
      parser.on("finish", () => {
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
        resolve();
      });
    });
  });
});
