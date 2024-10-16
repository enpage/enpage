import { Transform, type TransformCallback } from "node:stream";
import { HTMLStreamParser, type Callback } from "../common/html-parser";

export class NodeHTMLStreamParser extends Transform {
  private parser: HTMLStreamParser;

  constructor(callback: Callback) {
    super({ readableObjectMode: true, writableObjectMode: true });
    this.parser = new HTMLStreamParser(callback);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    this.parser.write(chunk.toString());
    callback();
  }

  _flush(callback: TransformCallback) {
    this.parser.end();
    callback();
  }
}
