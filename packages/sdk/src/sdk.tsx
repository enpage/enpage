class EnpageSDK {
  goToSection(section: string | number) {}
  nextSection() {
    console.log("next section");
  }
  prevSection() {
    console.log("prev section");
  }
}

export const enpage = new EnpageSDK();
