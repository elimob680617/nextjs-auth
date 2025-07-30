import { cookies } from "next/headers";
import { decryptSession } from "@/app/utils/session";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get("clb-session")?.value;
  if (!encryptedSession) {
    return NextResponse.json({ error: "Session Not found" }, { status: 400 });
  }
  const session = await decryptSession(encryptedSession);

  return NextResponse.json(session);
}
