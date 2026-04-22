import { motion, type HTMLMotionProps } from "framer-motion";
import { sectionReveal } from "@/lib/animations";
import { cn } from "@/lib/cn";

export type AnimatedSectionProps = HTMLMotionProps<"section"> & {
  /** Si false, sección sin reveal al scroll (sigue siendo motion para tipos unificados) */
  reveal?: boolean;
  viewportAmount?: number | "some" | "all";
};

const scrollMt = "scroll-mt-28 sm:scroll-mt-32";

/**
 * `<section>` con scroll-margin y reveal opcional al viewport.
 */
export function AnimatedSection({
  className,
  reveal = true,
  viewportAmount = 0.16,
  variants = sectionReveal,
  initial,
  whileInView,
  viewport,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.section
      className={cn(scrollMt, className)}
      initial={reveal ? (initial ?? "hidden") : initial}
      whileInView={reveal ? (whileInView ?? "visible") : whileInView}
      viewport={reveal ? (viewport ?? { once: true, amount: viewportAmount }) : viewport}
      variants={reveal ? variants : undefined}
      {...props}
    />
  );
}
