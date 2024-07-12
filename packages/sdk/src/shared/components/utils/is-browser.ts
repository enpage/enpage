// Type guard to check if we're in a browser environment
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof customElements !== "undefined";
}
