import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Publicly accessible routes
const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)"
]);

// Admin-only routes
const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

// Protected user routes (requires authentication)
const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  "/product/(.*)", // Protect individual product pages
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();

  // Admin protection
  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Require login for protected routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Exclude internal/static files from middleware
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)", // Always apply to API routes
  ],
};
