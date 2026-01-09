"use client";

export const NAME_TOKEN_KEY = "ElEaasha_auth_token_client";
 
function base64UrlDecode(str: string): string {
  return decodeURIComponent(
    atob(str.replace(/-/g, "+").replace(/_/g, "/"))
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

/**
 * Helper to set cookie with expiry (in days)
 */
function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // days → ms
  const expires = "; expires=" + date.toUTCString();
  document.cookie = `${name}=${value}${expires}; path=/;`;
}

/**
 * Helper to get cookie by name
 */
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Helper to delete cookie
 */
function eraseCookie(name: string) {
  document.cookie = `${name}=; Max-Age=-1; path=/;`;
}

/**
 * Stores the authentication token in cookies (valid for 4 days).
 */
export function setAuthTokenClient(token: string): void {
  if (typeof window !== "undefined") {
    setCookie(NAME_TOKEN_KEY, token, 4);
  }
}

/**
 * Retrieves the authentication token from cookies.
 * Checks for JWT expiration and removes it if expired.
 */
export function getAuthTokenClient(): string | null {
  if (typeof window === "undefined") return null;

  const token = getCookie(NAME_TOKEN_KEY);
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (payload && typeof payload.exp === "number") {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      // Token expired
      removeAuthTokenClient();
      return null;
    }
  }

  return token;
}

/**
 * Removes the authentication token from cookies.
 */
export function removeAuthTokenClient(): void {
  if (typeof window !== "undefined") {
    eraseCookie(NAME_TOKEN_KEY);
  }
}

export function checkAuthStatus(): boolean {
  const token = getAuthTokenClient();
  return !!token;
}
