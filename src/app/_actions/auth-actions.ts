"use server";

import { SignInModel } from "@/app/(auth)/_types/auth.types";
import { headers, cookies } from "next/headers";
import { JWT, UserResponse, UserSession } from "@/app/_types/auth.types";
import { jwtDecode } from "jwt-decode";
import { json } from "node:stream/consumers";
import { decryptSession, encryptSession } from "@/app/utils/session";

export async function signInAction(model: SignInModel) {
  const headerList = headers();
  const userAgent = (await headerList).get("user-agent");
  try {
    const response = await fetch(
      "https://general-api.classbon.com/api/identity/signin",
      {
        method: "POST",
        body: JSON.stringify({ ...model, userAgent }),
        headers: {
          "Content-type": "application/json",
        },
      },
    );
    if (response.ok) {
      const user = await response.json();
      await setAuthCookieAction(user);
      return { isSuccess: true };
    }
  } catch {
    return {
      isSuccess: false,
    };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("clb-session")?.value;

  if (!sessionCookie) {
    return null;
  }

  const session = await decryptSession(sessionCookie);
  try {
    const response = await fetch(
      "https://general-api.classbon.com/api/identity/signout",
      {
        method: "POST",
        body: JSON.stringify({
          sessionId: (session as unknown as UserSession).sessionId,
        }),
        headers: {
          "Content-type": "application/json",
        },
      },
    );
    if (response.ok) {
      cookieStore.delete("clb.session");
      return { isSuccess: true };
    }
  } catch {
    return {
      isSuccess: false,
    };
  }
}

export async function setAuthCookieAction(user: UserResponse) {
  const decoded = jwtDecode<JWT>(user.accessToken);

  const session: UserSession = {
    username: decoded.username,
    fullName: decoded.fullName,
    pic: decoded.pic,
    exp: decoded.exp * 1000,
    accessToken: user.accessToken,
    sessionId: user.sessionId,
    sessionExpiry: user.sessionExpiry,
  };

  const cookieStore = await cookies();
  const encryptedSession = await encryptSession(session);
  const decryptedSession = await decryptSession(encryptedSession);

  cookieStore.set("clb-session", encryptedSession, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}
