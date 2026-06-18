// proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const secret = process.env.ACCESS_TOKEN_SECRET; // server-only, NOT NEXT_PUBLIC_
  if (!secret) {
    console.error("Missing ACCESS_TOKEN_SECRET");
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("accessToken");
    return res;
  }
}

export const config = {
  matcher: ["/chatflow/:path*"],
};
