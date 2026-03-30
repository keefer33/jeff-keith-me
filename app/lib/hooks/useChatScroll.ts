import { useScrollIntoView, type UseScrollIntoViewOptions } from "@mantine/hooks";
import { useCallback, useLayoutEffect, useRef } from "react";

export type UseChatScrollOptions = UseScrollIntoViewOptions & {
  /** When false, ResizeObserver is not attached (e.g. hidden panel). */
  enabled?: boolean;
};

/**
 * Chat-style autoscroll for Mantine ScrollArea: `scrollableRef` → `viewportRef`,
 * wrap scrollable content in an element with `scrollContentRef`, bottom sentinel with `targetRef`.
 * Uses {@link https://mantine.dev/hooks/use-scroll-into-view/ useScrollIntoView} plus ResizeObserver for layout reflows.
 */
export function useChatScroll(options?: UseChatScrollOptions) {
  const { enabled = true, ...scrollIntoOptions } = options ?? {};
  const { scrollIntoView, targetRef, scrollableRef, cancel } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >(scrollIntoOptions);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollIntoView({ alignment: "end" });
  }, [scrollIntoView]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const el = scrollContentRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return;
    }

    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        scrollIntoView({ alignment: "end" });
      });
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [enabled, scrollIntoView]);

  const scrollToTop = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const viewport = scrollableRef.current;
      if (!viewport) {
        return;
      }
      if (behavior === "smooth") {
        viewport.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        viewport.scrollTop = 0;
      }
    },
    [scrollableRef]
  );

  return {
    scrollableRef,
    /** Same ref as `scrollableRef` (older name). */
    viewportRef: scrollableRef,
    targetRef,
    scrollContentRef,
    scrollIntoView,
    scrollToBottom,
    scrollToTop,
    cancel,
  };
}
