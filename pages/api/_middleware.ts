import { NextRequest } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  if (req.page.name === "/api/auth/login") return;

  const adminPw = process.env.ADMIN_PW || "";
  const authorization = req.headers.get("Authorization");
  if (authorization) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, adminPw);
    } catch (e) {
      console.error(e);
      if (e instanceof JsonWebTokenError) {
        return new Response(e.message, {
          status: 401,
          headers: {
            "Set-Cookie": "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
          },
        });
      } else {
        return new Response(null, {
          status: 401,
          headers: {
            "Set-Cookie": "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
          },
        });
      }
    }
  }
}
