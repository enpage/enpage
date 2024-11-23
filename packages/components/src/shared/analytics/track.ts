import type { BeaconPayload } from "./types";

window.upAnalyticsQueue = window.upAnalyticsQueue || [];

export function track(type: BeaconPayload["e"], data: BeaconPayload["d"] = {}) {
  const payload: BeaconPayload = {
    e: type,
    t: new Date().toISOString(),
    d: data,
  };
  window.upAnalyticsQueue.push(payload);
}
