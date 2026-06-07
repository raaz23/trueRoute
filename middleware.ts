import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getSupabaseUserFromRequest, isFounderAdminUser } from "@/lib/auth/admin-session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailVerified } from "@/lib/auth/founder";
import { verifyAdminTokenEdge } from "@/lib/auth/admin-edge";

const ADMIN_PUBLIC = ["/admin/login", "/api/admin/login", "/auth/admin-callback"];

const VERIFIED_ONLY_PATHS = ["/submit-price", "/profile"];

async function isLocalAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("tr_admin_session")?.value;
  return verifyAdminTokenEdge(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (ADMIN_PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return updateSession(request);
    }

    let authorized = false;

    if (isSupabaseConfigured()) {
      const user = await getSupabaseUserFromRequest(request);
      authorized = isFounderAdminUser(user);
      if (!authorized && pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!authorized) {
        const login = new URL("/admin/login", request.url);
        login.searchParams.set("next", pathname);
        if (user && !isEmailVerified(user)) login.searchParams.set("error", "verify_email");
        else if (user) login.searchParams.set("error", "wrong_account");
        return NextResponse.redirect(login);
      }
    } else {
      authorized = await isLocalAdmin(request);
      if (!authorized) {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const login = new URL("/admin/login", request.url);
        login.searchParams.set("next", pathname);
        return NextResponse.redirect(login);
      }
    }

    return updateSession(request);
  }

  if (
    isSupabaseConfigured() &&
    VERIFIED_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    const user = await getSupabaseUserFromRequest(request);
    if (user && !isEmailVerified(user)) {
      const pending = new URL("/auth/verify-pending", request.url);
      pending.searchParams.set("email", user.email ?? "");
      return NextResponse.redirect(pending);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/submit-price",
    "/profile",
    "/profile/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
