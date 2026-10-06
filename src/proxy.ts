import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const wanted = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  return wanted.find((code) => (locales as readonly string[]).includes(code)) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|video|images|favicon.ico|icon.svg|.*\..*).*)"],
};
