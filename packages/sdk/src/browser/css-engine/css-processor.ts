interface Task {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  change?: Change;
  overrides?: StyleOverrides;
}

interface Change {
  type: string;
  selector: string;
  property?: string;
  value?: string;
}

interface StyleOverrides {
  [selector: string]: {
    [property: string]: string;
  };
}

interface WorkerMessage {
  type: "initialized" | "processed" | "error";
  result?: ProcessingResult;
  message?: string;
}

interface ProcessingResult {
  css: string;
  warnings: string[];
  changes: { [selector: string]: string };
}

export class CSSProcessor {
  private worker: Worker;
  private initialized: boolean = false;
  private pendingTasks: Task[] = [];

  constructor() {
    this.worker = new Worker("css-worker.js");
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.worker.onerror = this.handleWorkerError.bind(this);
  }

  private handleWorkerMessage(e: MessageEvent<WorkerMessage>): void {
    if (e.data.type === "initialized") {
      this.initialized = true;
      this.processPendingTasks();
    } else if (e.data.type === "processed") {
      const task = this.pendingTasks.shift();
      if (task) {
        task.resolve(e.data.result);
      }
      this.processPendingTasks();
    }
  }

  private handleWorkerError(error: ErrorEvent): void {
    const task = this.pendingTasks.shift();
    if (task) {
      task.reject(error);
    }
    this.processPendingTasks();
  }

  public initialize(css: string, overrides: StyleOverrides): Promise<ProcessingResult> {
    return new Promise((resolve, reject) => {
      this.pendingTasks.push({ resolve, reject });
      this.worker.postMessage({ type: "init", css, overrides });
    });
  }

  public processChange(change: Change, overrides: StyleOverrides): Promise<ProcessingResult> {
    return new Promise((resolve, reject) => {
      this.pendingTasks.push({ resolve, reject, change, overrides });
      if (this.initialized) {
        this.processPendingTasks();
      }
    });
  }

  private processPendingTasks(): void {
    if (this.pendingTasks.length > 0 && this.initialized) {
      const nextTask = this.pendingTasks[0];
      if (nextTask.change) {
        this.worker.postMessage({ type: "change", change: nextTask.change, overrides: nextTask.overrides });
      }
    }
  }
}
