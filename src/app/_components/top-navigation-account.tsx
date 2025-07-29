"use client";

import { useSessionStore } from "@/app/_stores/auth.store";

export const TopNavigationAccount = () => {
  const status = useSessionStore((state) => state.status);
  return <>{status}</>;
};
