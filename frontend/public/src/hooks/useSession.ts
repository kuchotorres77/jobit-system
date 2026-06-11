import { useEffect, useState } from "react";
import { getSessionUser, SESSION_CHANGE_EVENT, SessionUser } from "@/api";

export function useSession(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(getSessionUser);

  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    window.addEventListener(SESSION_CHANGE_EVENT, sync);
    // "storage" cubre login/logout hechos desde otra pestaña
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return user;
}
