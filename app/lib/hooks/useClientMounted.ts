import { useLayoutEffect, useState } from "react";

/**
 * False on SSR and the first client render, then true after layout (before paint).
 * Use so theme-dependent markup matches server HTML, then updates to match storage.
 */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
