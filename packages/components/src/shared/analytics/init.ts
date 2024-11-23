window.upAnalyticsQueue = window.upAnalyticsQueue || [];

document.addEventListener("visibilitychange", function logData() {
  if (document.visibilityState === "hidden") {
    const payload = JSON.stringify(window.upAnalyticsQueue);
    if (navigator.sendBeacon?.("/_/", payload)) {
      window.upAnalyticsQueue = [];
    }
  }
});
