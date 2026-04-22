import { useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";

export type ParallaxMouseState = {
  /** -1 … 1 relativo al contenedor */
  x: number;
  /** -1 … 1 relativo al contenedor */
  y: number;
  /** Si el puntero aporta parallax (desktop fino, sin reduced motion) */
  enabled: boolean;
};

type Options = {
  disabled?: boolean;
};

/**
 * Parallax leve: un `mousemove` por contenedor, agregado en RAF.
 * No opera en ≤768px, pointer coarse, reduced motion ni `disabled`.
 */
export function useParallaxMouse<T extends HTMLElement = HTMLElement>(
  options: Options = {},
): [RefObject<T | null>, ParallaxMouseState] {
  const { disabled = false } = options;
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion() === true;
  const rafId = useRef<number | null>(null);
  const pending = useRef<{ cx: number; cy: number } | null>(null);

  const [state, setState] = useState<ParallaxMouseState>({ x: 0, y: 0, enabled: false });

  const flush = useCallback(() => {
    const el = ref.current;
    const p = pending.current;
    rafId.current = null;
    pending.current = null;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((p.cx - rect.left) / rect.width) * 2 - 1;
    const y = ((p.cy - rect.top) / rect.height) * 2 - 1;
    const nx = Math.max(-1, Math.min(1, x));
    const ny = Math.max(-1, Math.min(1, y));
    setState((prev) => {
      if (prev.x === nx && prev.y === ny) return prev;
      return { ...prev, x: nx, y: ny };
    });
  }, []);

  useLayoutEffect(() => {
    const narrow = window.matchMedia("(max-width: 768px)");
    const coarse = window.matchMedia("(pointer: coarse)");

    const allowFor = (el: T | null) =>
      Boolean(
        el && !disabled && !reducedMotion && !narrow.matches && !coarse.matches,
      );

    let el = ref.current;
    let rafRetry: number | null = null;

    const bind = (target: T) => {
      const onMove = (e: MouseEvent) => {
        pending.current = { cx: e.clientX, cy: e.clientY };
        if (rafId.current != null) return;
        rafId.current = window.requestAnimationFrame(flush);
      };

      const onLeave = () => {
        setState((s) => ({ ...s, x: 0, y: 0 }));
      };

      const onMq = () => {
        const ok = allowFor(target);
        setState((s) => ({ ...s, enabled: ok }));
        if (!ok && rafId.current != null) {
          window.cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
      };

      setState((s) => ({ ...s, enabled: true }));

      target.addEventListener("mousemove", onMove, { passive: true });
      target.addEventListener("mouseleave", onLeave);
      narrow.addEventListener("change", onMq);
      coarse.addEventListener("change", onMq);

      return () => {
        target.removeEventListener("mousemove", onMove);
        target.removeEventListener("mouseleave", onLeave);
        narrow.removeEventListener("change", onMq);
        coarse.removeEventListener("change", onMq);
        if (rafId.current != null) {
          window.cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        setState({ x: 0, y: 0, enabled: false });
      };
    };

    let attempts = 0;
    let cleanup: (() => void) | undefined;

    const tryBind = () => {
      el = ref.current;
      if (!el) {
        attempts += 1;
        if (attempts < 24) {
          rafRetry = window.requestAnimationFrame(() => {
            rafRetry = null;
            tryBind();
          });
        }
        return;
      }
      if (!allowFor(el)) {
        setState({ x: 0, y: 0, enabled: false });
        return;
      }
      cleanup = bind(el);
    };

    tryBind();

    return () => {
      if (rafRetry != null) window.cancelAnimationFrame(rafRetry);
      cleanup?.();
    };
  }, [disabled, reducedMotion, flush]);

  return [ref, state];
}
