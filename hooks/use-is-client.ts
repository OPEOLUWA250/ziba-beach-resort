import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True in the browser after hydration, false during server rendering. */
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}
