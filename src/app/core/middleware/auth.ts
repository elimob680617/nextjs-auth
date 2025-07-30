import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(request: NextRequest) {
  const session = request.cookies.get("clb-session")?.value;

  const authRoutes = ["/signin"];
  const protectedRoutes = ["/dashboard"];

  const { nextUrl } = request;
  const nextResponse = NextResponse.next();

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (!session) {
    if (isProtectedRoute) {
      const callback = encodeURIComponent(nextUrl.pathname);
      const signinRequest = request.nextUrl.clone();
      signinRequest.pathname = "/signin";
      return NextResponse.redirect(
        `${signinRequest}?callbackUrl = ${callback}`,
      );
    }
  }
}
