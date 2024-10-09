import { useEffect, type RefObject } from "react";

export const useMutationObserver = (ref: RefObject<Element> | string, callback: MutationCallback) => {
  useEffect(() => {
    const el = typeof ref === "string" ? document.querySelector(ref) : ref.current;
    if (el) {
      const observer = new MutationObserver(callback);
      observer.observe(el, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [callback, ref]);
};
