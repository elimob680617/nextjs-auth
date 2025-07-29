"use client";

import { useSessionStore } from "@/app/_stores/auth.store";
import { Button } from "@/app/_components/button";
import Image from "next/image";
import { useTransition } from "react";
import { signOutAction } from "@/app/_actions/auth-actions";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/_components/loading";

export const TopNavigationAccount = () => {
  const status = useSessionStore((state) => state.status);
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.clearSession);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const response = await signOutAction();
      if (response.isSuccess) {
        clearSession();
        router.push("/");
      }
    });
  };

  if (status === "loading") {
    return <p>...Loading</p>;
  }

  return (
    <>
      {status === "authenticated" ? (
        <div className="flex items-center gap-3">
          <Image
            className="rounded-full"
            width={48}
            height={48}
            src={session.pic}
            alt="user picture"
          />
          <p>{session.fullName}</p>|
          <div onClick={handleSignOut} className="text-error cursor-pointer">
            {isPending ? (
              <Loading color="error" size="xs" text="" />
            ) : (
              <span>خروج</span>
            )}
          </div>
        </div>
      ) : (
        <Button variant="outlined" href="/signin">
          ورود به سایت
        </Button>
      )}
    </>
  );
};
