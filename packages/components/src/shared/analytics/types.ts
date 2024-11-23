type EventType = "click" | "submit" | "custom";

export type BeaconPayload = {
  e: EventType; // event type
  t: string; // timestamp
  d?: Record<string, unknown>; // data
};

declare global {
  interface Window {
    upAnalyticsQueue: BeaconPayload[];
  }
}
