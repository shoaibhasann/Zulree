import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.REFRESH_TOKEN_SECRET;
const secretKey = new TextEncoder().encode(SECRET);


export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookieToken = request.cookies.get("refreshToken")?.value ?? null;

  // 🔐 NO TOKEN CASE
  if (!cookieToken) {
    // Admin pages/APIs must be protected
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Login page must be accessible to guests
    return NextResponse.next();
  }

  // 🔓 TOKEN PRESENT
  let token = cookieToken.startsWith("Bearer ")
    ? cookieToken.split(" ")[1]
    : cookieToken;
  token = decodeURIComponent(token);

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const role = payload.role;

    // 🚫 Logged-in user should not see login page
    if (pathname === "/login") {
      if (role === "Admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 🔐 Admin-only protection
    if (pathname.startsWith("/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Optional: forward identity to admin APIs
    const headers = new Headers(request.headers);
    headers.set("x-user-id", String(payload.sub));
    if (role) headers.set("x-user-role", role);

    return NextResponse.next({ request: { headers } });
  } catch (err) {
    // Invalid / expired token → treat as guest
    return NextResponse.redirect(new URL("/login", request.url));
  }
}


export const config = {
  matcher: ["/admin/:path*", "/api/v1/admin/:path*", "/login", "/api/v1/auth/me", "/api/v1/user/:path*"],
};