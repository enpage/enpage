import { WorkerCSSProcessor } from "./worker-css-processor";

const processor = new WorkerCSSProcessor();

interface WorkerMessage {
  type: "init" | "change" | "generate";
  css?: string;
  overrides?: StyleOverrides;
  change?: Change;
}

interface StyleOverrides {
  [selector: string]: {
    [property: string]: string;
  };
}

interface Change {
  type: string;
  selector: string;
  property?: string;
  value?: string;
}

self.onmessage = async function (e: MessageEvent<WorkerMessage>) {
  try {
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let result;
    switch (e.data.type) {
      case "init":
        await processor.initialize(e.data.css!, e.data.overrides!);
        result = processor.generateCSS();
        self.postMessage({ type: "initialized", result });
        break;
      case "change":
        result = await processor.processChange(e.data.change!, e.data.overrides!);
        self.postMessage({ type: "processed", result });
        break;
      case "generate":
        result = processor.generateCSS();
        self.postMessage({ type: "generated", result });
        break;
      default:
        throw new Error("Unknown message type");
    }
  } catch (error) {
    self.postMessage({ type: "error", message: (error as Error).message });
  }
};
