import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { sha512 } from "js-sha512";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { adminId, adminPw } = getConfig().serverRuntimeConfig.CONFIG;

    const { id, password } = req.body;

    if (!id || !password) return res.status(400).end();
    if (id !== adminId || sha512(password) !== sha512(adminPw)) return res.status(401).end();

    return res.status(200).end();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
