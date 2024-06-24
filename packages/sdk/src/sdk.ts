export class EnpageSDK {
  constructor() {}
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
}
