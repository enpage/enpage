import { Parser } from "htmlparser2";

type Attributes = { [key: string]: string };
export type Node = {
  type: "tag" | "text";
  name?: string;
  attributes?: Attributes;
  children?: Node[];
  data?: string;
};

export type Callback = (node: Node) => void;

export class HTMLStreamParser {
  private parser: Parser;
  private callback: Callback;
  private stack: Node[];
  private currentTextNode: Node | null;

  constructor(callback: Callback) {
    this.callback = callback;
    this.stack = [];
    this.currentTextNode = null;

    this.parser = new Parser(
      {
        onopentag: (name: string, attributes: Attributes) => {
          if (name.startsWith("ep-")) {
            this.flushTextNode();
            const node: Node = {
              type: "tag",
              name,
              attributes,
              children: [],
            };
            if (this.stack.length > 0) {
              this.stack[this.stack.length - 1].children!.push(node);
            }
            this.stack.push(node);
          }
        },
        ontext: (text: string) => {
          if (this.stack.length > 0) {
            const trimmedText = text.trim();
            if (trimmedText) {
              if (this.currentTextNode) {
                this.currentTextNode.data += ` ${trimmedText}`;
              } else {
                this.currentTextNode = {
                  type: "text",
                  data: trimmedText,
                };
              }
            }
          }
        },
        onclosetag: (name: string) => {
          if (name.startsWith("ep-")) {
            this.flushTextNode();
            this.completeNode();
          }
        },
        onend: () => {
          this.flushTextNode();
          // Parsing finished
        },
        onerror: (err) => {
          console.error("Parsing error:", err);
        },
      },
      {
        decodeEntities: true,
        recognizeSelfClosing: true,
      },
    );
  }

  private flushTextNode() {
    if (this.currentTextNode && this.stack.length > 0) {
      this.stack[this.stack.length - 1].children!.push(this.currentTextNode);
      this.currentTextNode = null;
    }
  }

  private completeNode() {
    const node = this.stack.pop();
    if (this.stack.length === 0 && node) {
      // Top-level node, pass to callback
      this.callback(node);
    }
  }

  write(chunk: string) {
    this.parser.write(chunk);
  }

  end() {
    this.parser.end();
  }
}
