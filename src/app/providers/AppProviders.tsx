import { Toaster } from "sonner";
import { InteractiveCursor } from "@/components/common/InteractiveCursor";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InteractiveCursor />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
