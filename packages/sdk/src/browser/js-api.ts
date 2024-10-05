import type { GenericPageContext } from "../shared/page-config";
import type { NavigateEvent } from "./events";

export type State = {
  ctx: GenericPageContext;
  pageIndex: number;
};

export class EnpageJavascriptAPI extends EventTarget {
  private _totalPages: number;

  constructor(
    private state: State,
    private _slugs: string[] = [],
  ) {
    super();
    this._totalPages = this.slugs.length
      ? this.slugs.length + 1
      : Array.from(document.querySelectorAll("body > section")).length;
    this.setupListeners();
  }

  private setupListeners() {
    this.addEventListener("beforenavigate", (e) => {
      const evt = e as NavigateEvent;
      const oldIndex = evt.detail.from;
      const newIndex = evt.detail.to;
      const slug = this.slugs.at(newIndex - 1);

      this.state.pageIndex = newIndex;
      history.pushState(
        { page: newIndex },
        "",
        newIndex === 0 ? "/" : slug ? `/${slug}` : `/page-${newIndex}`,
      );

      this.dispatchEvent(
        new CustomEvent("afternavigate", {
          detail: { from: oldIndex, to: newIndex } satisfies NavigateEvent["detail"],
          bubbles: true,
        }),
      );
    });
  }

  get currentPage() {
    return this.state.pageIndex;
  }

  get totalPages() {
    return this._totalPages;
  }

  get context() {
    return this.state.ctx;
  }

  nextPage() {
    if (this.canGoForward) {
      this.dispatchEvent(
        new CustomEvent("beforenavigate", {
          detail: { from: this.currentPage, to: this.currentPage + 1 } satisfies NavigateEvent["detail"],
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }

  previousPage() {
    if (this.canGoBack) {
      this.dispatchEvent(
        new CustomEvent("beforenavigate", {
          detail: { from: this.currentPage, to: this.currentPage - 1 } satisfies NavigateEvent["detail"],
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }

  goToPage(index: number) {
    if (index < 0 || index >= this.totalPages) {
      throw new RangeError(`Invalid page index: ${index}`);
    }
    this.dispatchEvent(
      new CustomEvent("beforenavigate", {
        detail: { from: this.currentPage, to: index },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  firstPage() {
    this.dispatchEvent(
      new CustomEvent("beforenavigate", {
        detail: { from: this.currentPage, to: 0 } satisfies NavigateEvent["detail"],
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  lastPage() {
    this.dispatchEvent(
      new CustomEvent("beforenavigate", {
        detail: { from: this.currentPage, to: this.totalPages - 1 },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  get canGoBack() {
    return this.state.pageIndex > 0;
  }

  get canGoForward() {
    return this.state.pageIndex < this.totalPages - 1;
  }

  get slugs() {
    return this._slugs;
  }

  async saveDataRecord(dataRecordId: string, record: Record<string, unknown>) {
    const res = await fetch(
      `%PUBLIC_ENPAGE_API_BASE_URL%/v1/sites/${window.location.hostname}/data-records/${dataRecordId}`,
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(record),
        headers: {
          "content-type": "application/json",
        },
      },
    );
    if (res.ok) {
      return res.json();
    }
    throw new Error(`Failed to save data record: ${res.statusText}`);
  }
}
