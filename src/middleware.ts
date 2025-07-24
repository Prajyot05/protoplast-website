import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Publicly accessible routes
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// Admin-only routes
const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

// Protected user routes (requires authentication)
// const isProtectedRoute = createRouteMatcher([
//   "/cart(.*)",
//   "/product/(.*)", // Protect individual product pages
// ]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // exclude _next and static files
    "/", // include root
    "/(api|trpc)(.*)", // include api routes
  ],
};
