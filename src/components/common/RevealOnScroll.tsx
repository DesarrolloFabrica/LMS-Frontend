import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { Variants } from "framer-motion";
import { sectionReveal } from "@/lib/animations";
import { cn } from "@/lib/cn";

export type RevealElement = "div" | "section" | "aside";

type BaseProps = {
  as?: RevealElement;
  className?: string;
  viewportAmount?: number | "some" | "all";
  variants?: Variants;
  children?: ReactNode;
};

export type RevealOnScrollProps = BaseProps &
  Omit<HTMLMotionProps<"div">, keyof BaseProps | "initial" | "whileInView" | "viewport">;

/**
 * Fade + leve translate al entrar en viewport (una vez).
 */
export function RevealOnScroll({
  as = "div",
  className,
  viewportAmount = 0.18,
  variants = sectionReveal,
  children,
  ...motionProps
}: RevealOnScrollProps) {
  const shared = {
    className: cn(className),
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: viewportAmount },
    variants,
    children,
    ...motionProps,
  };

  if (as === "section") return <motion.section {...shared} />;
  if (as === "aside") return <motion.aside {...shared} />;
  return <motion.div {...shared} />;
}
