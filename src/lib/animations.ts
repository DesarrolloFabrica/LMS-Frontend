import type { Transition, Variants } from "framer-motion";

/** Curvas y duraciones compartidas (consistencia entre secciones). */
export const motionEase = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
};

export const motionDuration = {
  xs: 0.25,
  sm: 0.35,
  md: 0.5,
  lg: 0.65,
  xl: 0.8,
  authBoot: 1.9,
  authSwitch: 0.5,
  authOverlay: 1.3,
  dashboardEntry: 0.9,
} as const;

export const motionStagger = {
  tight: 0.06,
  base: 0.1,
  relaxed: 0.14,
  authInputs: 0.08,
} as const;

const defaultEnter: Transition = {
  duration: motionDuration.md,
  ease: motionEase.out,
};

const reducedEnter: Transition = {
  duration: 0.01,
  ease: "linear",
};

/** Variantes de entrada suaves cuando `prefers-reduced-motion: reduce`. */
export function pickTransition(reducedMotion: boolean, full: Transition = defaultEnter): Transition {
  return reducedMotion ? reducedEnter : full;
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultEnter,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...defaultEnter, duration: motionDuration.md },
  },
};

export const authPanelIn: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: motionDuration.authSwitch, ease: motionEase.outExpo },
  },
};

export const dashboardEntryReveal: Variants = {
  hidden: { opacity: 0.72, scale: 0.986, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: motionDuration.dashboardEntry, ease: motionEase.outExpo },
  },
};

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.lg, ease: motionEase.outExpo },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionStagger.base,
      delayChildren: motionStagger.tight,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultEnter,
  },
};

/** Stagger atenuado (móvil / menos motion). */
export const staggerContainerTight: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionStagger.tight,
      delayChildren: 0.04,
    },
  },
};

/** `whileHover` — elevación ligera (tarjetas, bloques). */
export const hoverLift = {
  y: -4,
  transition: { type: "spring" as const, stiffness: 420, damping: 30 },
};

export const hoverLiftSubtle = {
  y: -2,
  transition: { type: "spring" as const, stiffness: 480, damping: 32 },
};

/** `whileHover` — resplandor suave (primario). */
export const softGlowHover = {
  boxShadow: "0 14px 44px -12px rgba(37, 99, 235, 0.28), 0 0 0 1px rgba(59, 130, 246, 0.12)",
  transition: { duration: motionDuration.sm, ease: motionEase.out },
};

/** `whileTap` — feedback de pulsación. */
export const scaleTap = { scale: 0.98 };

/** Loop muy sutil para un elemento destacado (hero). */
export const floatingLoopSubtle = {
  animate: { y: [0, -5, 0] },
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

/**
 * Ajusta variantes con stagger a una versión casi instantánea.
 * Usar con `useReducedMotion()` en el componente.
 */
export function reducedMotionVariants(
  reduced: boolean,
  variants: Variants,
  instantVisible: Variants = fadeIn,
): Variants {
  if (!reduced) return variants;
  return instantVisible;
}

export function reducedStaggerContainer(reduced: boolean): Variants {
  if (!reduced) return staggerContainer;
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0, delayChildren: 0, duration: 0.01 },
    },
  };
}
