import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get("authorization") as string;

  if (!bearerToken) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request" }),
      { status: 401 }
    );
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request" }),
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Unauthorized request" }),
      { status: 401 }
    );
  }
}
// the middleware will be activated only for the routes present in the matcher.
// without this config exported, the middleware will be run for each and every server call
export const config = {
  matcher: ["/api/auth/me"],
};
