import type { PageContext } from "@enpage/types/context";

export class EnpageSDK {
  constructor(
    private ctx: PageContext<any, any>,
    private mode: "dev" | "edit" | "view" | null = "dev",
  ) {
    this.#analysePage();
  }
  goToSection(section: string | number) {}

  nextSection() {
    console.log("next section");
  }

  prevSection() {
    console.log("prev section");
  }

  getContext() {
    return this.ctx;
  }

  #analysePage() {
    const templates = document.querySelectorAll("template");
  }
}
