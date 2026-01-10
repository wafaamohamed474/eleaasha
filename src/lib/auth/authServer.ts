
export const NAME_TOKEN_KEY = "ElEaasha_auth_token_server";
import { cookies } from "next/headers";

// ===== Helper: Decode JWT Payload =====
function base64UrlDecode(str: string): string {
  return decodeURIComponent(
    Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64")
      .toString("binary")
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decodedPayload = base64UrlDecode(parts[1]);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

// ====== Set Cookie ======
export async function setAuthTokenServer(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: NAME_TOKEN_KEY,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 4, // 4 أيام
  });
}

// ====== Get Cookie ======
export async function getAuthTokenServer(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAME_TOKEN_KEY)?.value;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (payload?.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      await removeAuthTokenServer();
      return null;
    }
  }

  return token;
}

// ====== Remove Cookie ======
export async function removeAuthTokenServer(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NAME_TOKEN_KEY);
}

// ====== Check Auth Status ======
export async function checkAuthStatusServer(): Promise<boolean> {
  const token = await getAuthTokenServer();
  return !!token;
}
