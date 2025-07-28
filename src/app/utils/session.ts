import { UserSession } from "@/app/_types/auth.types";
import { EncryptJWT, jwtDecrypt, JWTPayload } from "jose";

// Decodes base64 to Uint8Array, as jose expects the raw key bytes:

const JWT_SECRET = process.env.JWT_SECRET;
const encodedKey = Uint8Array.from(Buffer.from(JWT_SECRET, "base64"));

export async function encryptSession(session: UserSession): Promise<string> {
  return await new EncryptJWT(session as unknown as JWTPayload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(encodedKey);
}

export async function decryptSession(session: string) {
  const { payload } = await jwtDecrypt(session, encodedKey);
  return payload as unknown as UserSession;
}
