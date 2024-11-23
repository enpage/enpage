import type { BeaconPayload } from "./types";

export function track(type: BeaconPayload["e"], data: BeaconPayload["d"] = {}) {
  const payload: BeaconPayload = {
    e: type,
    t: new Date().toISOString(),
    d: data,
  };
  window.upAnalyticsQueue.push(payload);
}
