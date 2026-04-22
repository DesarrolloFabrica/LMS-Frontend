import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type MediaMotionProfile = {
  reducedMotion: boolean;
  isCoarsePointer: boolean;
  isMobileLayout: boolean;
  /** Parallax, tilt, loops largos, stagger marcado */
  allowRichMotion: boolean;
};

/**
 * Perfil único para simplificar motion en móvil / pointer grueso / reduced motion.
 */
export function useMediaMotionProfile(): MediaMotionProfile {
  const reducedMotionPref = useReducedMotion();
  const reducedMotion = reducedMotionPref === true;
  const [isCoarsePointer, setCoarse] = useState(false);
  const [isMobileLayout, setNarrow] = useState(false);

  useEffect(() => {
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      setCoarse(mqCoarse.matches);
      setNarrow(mqNarrow.matches);
    };
    sync();
    mqCoarse.addEventListener("change", sync);
    mqNarrow.addEventListener("change", sync);
    return () => {
      mqCoarse.removeEventListener("change", sync);
      mqNarrow.removeEventListener("change", sync);
    };
  }, []);

  const allowRichMotion = !reducedMotion && !isCoarsePointer && !isMobileLayout;

  return {
    reducedMotion,
    isCoarsePointer,
    isMobileLayout,
    allowRichMotion,
  };
}
