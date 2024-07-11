import type { PageContext } from "@enpage/types/context";

type NavigateEvent = CustomEvent<{ from: number; to: number }>;

export class EnpageSDK extends EventTarget {
  private pageIndex = 0;
  private pagesCount = 0;

  constructor(
    private ctx: PageContext<any, any>,
    private pagesSlugs: string[] = [],
  ) {
    super();
    this.#analysePage();
    this.setupListeners();
  }

  private setupListeners() {
    this.addEventListener("beforenavigate", (e) => {
      const evt = e as NavigateEvent;
      const oldIndex = evt.detail.from;
      const newIndex = evt.detail.to;
      document.querySelectorAll("body > section").forEach((section, index) => {
        if (index === newIndex) {
          section.removeAttribute("hidden");
        } else {
          section.setAttribute("hidden", "");
        }
      });
      this.pageIndex = newIndex;
      this.dispatchEvent(
        new CustomEvent("afternavigate", {
          detail: { from: oldIndex, to: newIndex } satisfies NavigateEvent["detail"],
          bubbles: true,
        }),
      );
      const slug = this.pagesSlugs[newIndex];
      history.pushState({ page: newIndex }, "", newIndex === 0 ? "/" : slug ? `/${slug}` : undefined);
    });
  }

  get currentPage() {
    return this.pageIndex;
  }

  get totalPages() {
    return this.pagesCount;
  }

  get context() {
    return this.ctx;
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
    if (index < 0 || index >= this.pagesCount) {
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
        detail: { from: this.currentPage, to: this.pagesCount - 1 },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  get canGoBack() {
    return this.pageIndex > 0;
  }

  get canGoForward() {
    return this.pageIndex < this.pagesCount - 1;
  }

  #analysePage() {
    this.pagesCount = document.querySelectorAll("body > section").length;
  }
}
