import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/exams") ||
    pathname.startsWith("/create-exam") ||
    pathname.startsWith("/students") ||
    pathname.startsWith("/live-proctoring") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  if (isProtectedRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exams/:path*",
    "/create-exam/:path*",
    "/students/:path*",
    "/live-proctoring/:path*",
    "/results/:path*",
    "/analytics/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};