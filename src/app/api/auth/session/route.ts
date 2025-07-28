import { cookies } from "next/headers";
import { decryptSession } from "@/app/utils/session";

export async function GET() {
  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get("clb-session")?.value;
  const session = await decryptSession(encryptedSession);

  return Response.json(session);
}
