import { processes } from "@/data/mockProcesses";
export const historyItems = processes.filter((p) => p.status === "aprobado");

