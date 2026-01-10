import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { NAME_TOKEN_KEY } from "./lib/auth/authServer";
 

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let locale = pathname.split("/")[1];
  // Skip internal Next.js paths and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // لو الـ locale مش موجود أو مش صالح → نستخدم الافتراضي
  if (!["ar", "en"].includes(locale)) {
    locale = "ar";
    const redirectUrl = new URL(`/${locale}${pathname}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const pathWithoutLocale = pathname.replace(/^\/(ar|en)(\/|$)/, "/");
  const token = req.cookies.get(NAME_TOKEN_KEY)?.value;
  const isProtected = pathWithoutLocale.startsWith("/dashboard");

  // إذا المستخدم دخل على /ar أو /en و عنده توكن → يروح للداشبورد
  if ((pathname === `/${locale}` || pathname === `/${locale}/`) && token) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // حماية مسار dashboard
  if (isProtected) {
    if (!token) return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return NextResponse.next();
}
