import { processes } from "@/data/mockProcesses";
export const reviewQueue = processes.filter((p) => p.status !== "aprobado");

