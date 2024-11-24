export function init() {
  window.upstartQueue = window.upstartQueue || [];
  document.addEventListener("visibilitychange", function logData() {
    if (document.visibilityState === "hidden") {
      const payload = JSON.stringify(window.upstartQueue);
      if (navigator.sendBeacon?.(window.location.pathname, payload)) {
        console.debug("beacon sent", payload);
        window.upstartQueue = [];
      } else {
        console.debug("beacon failed", payload);
      }
    }
  });
}
