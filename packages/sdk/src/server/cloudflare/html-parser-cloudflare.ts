import { HTMLStreamParser, type Callback } from "../common/html-parser";

export class CloudflareHTMLStreamParser {
  private parser: HTMLStreamParser;

  constructor(callback: Callback) {
    this.parser = new HTMLStreamParser(callback);
  }

  async processStream(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      this.parser.write(chunk);
    }
    this.parser.end();
  }
}
