import type { BeaconPayload } from "./types";

export function track(type: BeaconPayload["e"], data: BeaconPayload["d"] = {}) {
  const payload: BeaconPayload = {
    e: type,
    t: Date.now(),
    d: data,
  };
  window.upstartQueue.push(payload);
}

document.addEventListener(
  "click",
  function (e) {
    const target = e.target as HTMLElement;
    track("click", {
      buttonId: target.id,
    });
  },
  true,
);
