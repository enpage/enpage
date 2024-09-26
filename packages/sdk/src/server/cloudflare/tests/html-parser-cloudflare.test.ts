import { describe, it, expect, vi } from "vitest";
import { CloudflareHTMLStreamParser } from "../html-parser-cloudflare";

// Helper function to create a ReadableStream from a string
function createReadableStream(input: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const chunk = encoder.encode(input);
      controller.enqueue(chunk);
      controller.close();
    },
  });
}

describe("CloudflareHTMLStreamParser", () => {
  it("should parse a simple ep- tag", async () => {
    const callback = vi.fn();
    const parser = new CloudflareHTMLStreamParser(callback);
    const stream = createReadableStream("<ep-div>Hello</ep-div>");

    await parser.processStream(stream);

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-div",
      attributes: {},
      children: [{ type: "text", data: "Hello" }],
    });
  });

  it("should parse nested ep- tags", async () => {
    const callback = vi.fn();
    const parser = new CloudflareHTMLStreamParser(callback);
    const stream = createReadableStream("<ep-outer><ep-inner>Nested</ep-inner></ep-outer>");

    await parser.processStream(stream);

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

  it("should handle attributes on ep- tags", async () => {
    const callback = vi.fn();
    const parser = new CloudflareHTMLStreamParser(callback);
    const stream = createReadableStream('<ep-element class="test" id="myElem">With attributes</ep-element>');

    await parser.processStream(stream);

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-element",
      attributes: { class: "test", id: "myElem" },
      children: [{ type: "text", data: "With attributes" }],
    });
  });

  it("should handle chunked input with ep- tags", async () => {
    const callback = vi.fn();
    const parser = new CloudflareHTMLStreamParser(callback);
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode("<ep-chunk>"));
        controller.enqueue(encoder.encode("Chunked "));
        controller.enqueue(encoder.encode("input"));
        controller.enqueue(encoder.encode("</ep-chunk>"));
        controller.close();
      },
    });

    await parser.processStream(stream);

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-chunk",
      attributes: {},
      children: [{ type: "text", data: "Chunked input" }],
    });
  });

  it("should ignore non-ep- tags", async () => {
    const callback = vi.fn();
    const parser = new CloudflareHTMLStreamParser(callback);
    const stream = createReadableStream("<div><p>Ignored</p><ep-custom>Parsed</ep-custom></div>");

    await parser.processStream(stream);

    expect(callback).toHaveBeenCalledWith({
      type: "tag",
      name: "ep-custom",
      attributes: {},
      children: [{ type: "text", data: "Parsed" }],
    });
  });

  it("should handle multiple top-level ep- nodes", async () => {
    const callback = vi.fn();
    const parser = new CloudflareHTMLStreamParser(callback);
    const stream = createReadableStream("<ep-first>First</ep-first><ep-second>Second</ep-second>");

    await parser.processStream(stream);

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
});
