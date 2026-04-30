import { useEffect } from "react";
import { toast } from "sonner";
import { SESSION_ACTIVITY_THROTTLE_MS, isSessionIdleExpired } from "@/lib/session";
import { useAuthStore } from "@/store/authStore";
import { useRequestsStore } from "@/store/requestsStore";

const ACTIVITY_EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

export function useSessionIdleTimeout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const touchSession = useAuthStore((state) => state.touchSession);
  const user = useAuthStore((state) => state.user);
  const clearRequests = useRequestsStore((state) => state.clearRequests);

  useEffect(() => {
    if (!user) return undefined;

    let lastTouchAt = 0;

    const expireSession = () => {
      clearSession();
      clearRequests();
      toast.info("Sesión cerrada por inactividad.");
    };

    const checkExpiration = () => {
      const { lastActivityAt, user: currentUser } = useAuthStore.getState();
      if (currentUser && isSessionIdleExpired(lastActivityAt)) {
        expireSession();
        return true;
      }
      return false;
    };

    const registerActivity = () => {
      if (checkExpiration()) return;

      const now = Date.now();
      if (now - lastTouchAt >= SESSION_ACTIVITY_THROTTLE_MS) {
        lastTouchAt = now;
        touchSession(now);
      }
    };

    checkExpiration();

    const intervalId = window.setInterval(checkExpiration, SESSION_ACTIVITY_THROTTLE_MS);
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, registerActivity, { passive: true });
    });
    window.addEventListener("focus", checkExpiration);
    document.addEventListener("visibilitychange", checkExpiration);

    return () => {
      window.clearInterval(intervalId);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, registerActivity);
      });
      window.removeEventListener("focus", checkExpiration);
      document.removeEventListener("visibilitychange", checkExpiration);
    };
  }, [clearRequests, clearSession, touchSession, user]);
}

