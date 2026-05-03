import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute || request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Supabase browser auth is stored in local storage by default, so server-side
  // middleware cannot reliably read session state from cookies here.
  // Keep admin routes accessible; backend /api/admin/* remains the auth source of truth.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
