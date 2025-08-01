import { NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/app/utils/session";
import { UserResponse, UserSession } from "@/app/_types/auth.types";
import { cookies } from "next/headers";
import { setAuthCookieAction } from "@/app/_actions/auth-actions";

export async function authMiddleware(request: NextRequest) {
  const session = request.cookies.get("clb-session")?.value;

  const authRoutes = ["/signin"];
  const protectedRoutes = ["/dashboard"];

  const signinRoute = request.nextUrl.clone();

  const { nextUrl } = request;
  const nextResponse = NextResponse.next();

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (!session) {
    if (isProtectedRoute) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname);

      signinRoute.pathname = "/signin";
      return NextResponse.redirect(`${signinRoute}?callbackUrl=${callbackUrl}`);
    } else {
      return nextResponse;
    }
  }

  try {
    const parsed = (await decryptSession(session)) as unknown as UserSession;
    const now = Date.now();
    const accessExpired = parsed.exp < now;
    const refreshExpired = parsed.sessionExpiry < now;

    if (!accessExpired && !refreshExpired && isAuthRoute) {
      const dashboardRoute = request.nextUrl.clone();
      dashboardRoute.pathname = "/dashboard/courses";
      return NextResponse.redirect(dashboardRoute);
    }

    if (refreshExpired) {
      const cookieStore = await cookies();
      cookieStore.delete("clb-session");

      signinRoute.pathname = "/signin";
      return NextResponse.redirect(signinRoute);
    }

    if (accessExpired && !refreshExpired) {
      try {
        const response = await fetch(
          "https://general-api.classbon.com/api/identity/refresh-token",
          {
            method: "POST",
            body: JSON.stringify({ sessionId: parsed.sessionId }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const user = (await response.json()) as unknown as UserResponse;
          await setAuthCookieAction(user);
        }
      } catch {
        signinRoute.pathname = "/signin";
        return NextResponse.redirect(`${signinRoute}`);
      }
    }
  } catch {
    return NextResponse.redirect(`${signinRoute}`);
  }

  return nextResponse;
}
