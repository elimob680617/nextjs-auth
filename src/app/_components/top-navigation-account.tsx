"use client";

import { useSessionStore } from "@/app/_stores/auth.store";
import { Button } from "@/app/_components/button";
import Image from "next/image";
import Link from "next/link";

export const TopNavigationAccount = () => {
  const status = useSessionStore((state) => state.status);
  const session = useSessionStore((state) => state.session);

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
          <Link href={``} passHref className="text-error">
            خروج
          </Link>
        </div>
      ) : (
        <Button variant="outlined" href="/signin">
          ورود به سایت
        </Button>
      )}
    </>
  );
};
