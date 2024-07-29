import type { NavigateEvent } from "./events";

/**
 * Initialize animations for elements with `ep-animate-appear` and `ep-animate-disappear` attributes.
 *
 * The following lifecycle is followed:
 *
 * 1. When the page is loaded, elements with `ep-animate-appear` are animated in.
 * 2. When the page is navigated, elements with `ep-animate-disappear` are animated out.
 * 3. When the page is navigated, elements with `ep-animate-appear` are animated in.
 *
 * To orchestrate animations, the following attributes are set:
 *
 * - When a element is going to be animated in, the `ep-animating-in` attribute is set.
 * - When a element is going to be animated out, the `ep-animating-out` attribute is set.
 *
 * Those attributes are detected by the MutationObserver to trigger the animations.
 *
 */
function initAnimations() {
  monitorTransitions();
  monitorNavigation();
  animateSectionOnLoad();
}

function animateSectionOnLoad() {
  // get the section corresponding to the current page
  const currentPage = window.enpage.currentPage;
  const section = document.querySelector<HTMLElement>(`body > section:nth-child(${currentPage + 1})`);
  if (section?.hasAttribute("ep-animate-appear")) {
    section.setAttribute("ep-animating-in", "");
  }
}

function monitorTransitions() {
  const observer = getMutationObserver();
  const observerConfig = {
    attributeFilter: ["ep-animating-in", "ep-animating-out"],
    attributeOldValue: true,
  };
  const elements = document.querySelectorAll<HTMLElement>("[ep-animate-appear], [ep-animate-disappear]");
  elements.forEach((el) => {
    observer.observe(el, observerConfig);
  });
}

function monitorNavigation() {
  window.enpage.addEventListener("beforenavigate", (event) => {
    const detail = (event as NavigateEvent).detail;
    const fromElement = document.querySelector<HTMLElement>(`body > section:nth-child(${detail.from + 1})`);
    const toElement = document.querySelector<HTMLElement>(`body > section:nth-child(${detail.to + 1})`);

    if (!toElement || !fromElement) {
      throw new Error("Could not find the elements to animate");
    }

    if (toElement.getAttribute("ep-animate-appear-mode") === "parallel") {
      const top = fromElement.style.top;
      const left = fromElement.style.left;
      const width = fromElement.style.width;
      const position = window.getComputedStyle(fromElement).position;
      // if the animation is parallel, we need to convert the element to absolute
      // to make sure it's not affected by the layout of the other elements
      convertToAbsolute(fromElement);
      // when animation ends, we restore the positionning
      const onAnimEnd = () => {
        fromElement.style.position = position;
        fromElement.style.top = top;
        fromElement.style.left = left;
        fromElement.style.width = width;
        fromElement.removeEventListener("animationend", onAnimEnd);
      };
      fromElement.addEventListener("animationend", onAnimEnd);
      toElement.setAttribute("ep-animating-in", "");
    } else {
      const onAnimEnd = () => {
        toElement.setAttribute("ep-animating-in", "");
        fromElement.removeEventListener("animationend", onAnimEnd);
      };
      fromElement.addEventListener("animationend", onAnimEnd);
    }

    fromElement.setAttribute("ep-animating-out", "");
  });
}

function animate(el: HTMLElement, direction: "in" | "out") {
  const { appearAnimation, disappearAnimation } = getElementAnimations(el);
  const animation = direction === "in" ? appearAnimation : disappearAnimation;
  const oldAnimation = direction === "in" ? disappearAnimation : appearAnimation;
  if (animation.animation) {
    // clean old animation classes
    el.classList.remove("animate__animated");
    if (oldAnimation.animation) {
      el.classList.remove(`animate__${oldAnimation.animation}`);
    }
    const onAnimOutEnd = () => {
      el.setAttribute("hidden", "");
      el.removeEventListener("animationend", onAnimOutEnd);
    };
    if (direction === "out") {
      el.addEventListener("animationend", onAnimOutEnd);
    }
    if (animation.duration) {
      el.style.setProperty("--animate-duration", animation.duration);
    }
    if (animation.delay) {
      el.style.setProperty("--animate-delay", animation.delay);
    }
    el.classList.add("animate__animated", `animate__${animation.animation}`);
    if (direction === "in") {
      el.removeAttribute("hidden");
    }
  }
}

function getElementAnimations(el: HTMLElement) {
  const appearAnimation = {
    animation: el.getAttribute("ep-animate-appear"),
    delay: el.getAttribute("ep-animate-appear-delay"),
    duration: el.getAttribute("ep-animate-appear-duration"),
  };
  const disappearAnimation = {
    animation: el.getAttribute("ep-animate-disappear"),
    delay: el.getAttribute("ep-animate-disappear-delay"),
    duration: el.getAttribute("ep-animate-disappear-duration"),
  };
  return { appearAnimation, disappearAnimation };
}

function getMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.attributeName) return;
      const newValue = (mutation.target as HTMLElement).getAttribute(mutation.attributeName);
      if (newValue === null) return;
      animate(mutation.target as HTMLElement, mutation.attributeName === "ep-animating-in" ? "in" : "out");
    });
  });
  return observer;
}

function convertToAbsolute(element: HTMLElement) {
  // Get the element's current position and dimensions
  const rect = element.getBoundingClientRect();
  const parentRect = element.parentElement!.getBoundingClientRect();

  // Calculate the offset from the parent
  const topOffset = rect.top - parentRect.top;
  const leftOffset = rect.left - parentRect.left;

  // Store the current scroll position
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Set the element to position: absolute
  element.style.position = "absolute";

  // Set the top and left values
  element.style.top = `${topOffset + scrollY}px`;
  element.style.left = `${leftOffset + scrollX}px`;

  // Ensure the width remains the same
  element.style.width = `${rect.width}px`;

  // If the parent is not already positioned, set it to position: relative
  const parentPosition = window.getComputedStyle(element.parentElement!).position;
  if (parentPosition === "static") {
    element.parentElement!.style.position = "relative";
  }
}

initAnimations();
