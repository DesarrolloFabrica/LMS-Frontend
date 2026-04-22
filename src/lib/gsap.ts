import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registra plugins GSAP una sola vez (importar antes de usar ScrollTrigger). */
export function registerGsapPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };

registerGsapPlugins();
