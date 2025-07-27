"use server";

import { SignInModel } from "@/app/(auth)/_types/auth.types";
import { headers, cookies } from "next/headers";
import { JWT, UserResponse, UserSession } from "@/app/_types/auth.types";
import { jwtDecode } from "jwt-decode";
import { json } from "node:stream/consumers";

export async function signinAction(model: SignInModel) {
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
      return { isSuccess: true, response: user };
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

  const cookieStore = new cookies();
  cookieStore.set("clb-session", JSON.stringify(session), {
    httpOnly: true,
  });
}
