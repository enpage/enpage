export class EnpageSDK {
  constructor(private mode: "dev" | "edit" | "view" | null = "dev") {
    console.log("hello from sdk!");
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
    return window._enpageCtx;
  }

  #analysePage() {
    const templates = document.querySelectorAll("template");
  }
}
