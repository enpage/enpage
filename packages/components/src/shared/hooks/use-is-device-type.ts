import { useMediaQuery } from "usehooks-ts";

export function useIsMobileDevice() {
  return useMediaQuery("(min-device-width: 320px) and (max-device-width: 480px)", {
    initializeWithValue: false,
  });
}

export function useIsTabletDevice() {
  // 1366px is iPad Pro 12.9"
  return useMediaQuery("(min-device-width: 481px) and (max-device-width: 1366px)", {
    initializeWithValue: false,
  });
}

export function useIsLargeDevice() {
  return useMediaQuery("(min-device-width: 1367px)", { initializeWithValue: false });
}
