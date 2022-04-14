import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { sha512 } from "js-sha512";
import { SignJWT } from "jose";
import { setCookies } from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { adminId, adminPw } = getConfig().serverRuntimeConfig.CONFIG;

    const { id, password } = req.body;

    if (!id || !password) return res.status(400).end();
    if (id !== adminId || sha512(password) !== sha512(adminPw)) return res.status(401).end();

    const token = await new SignJWT({ id })
      .setProtectedHeader({ alg: "HS512" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(adminPw));
    setCookies("token", token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.status(200).end();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
