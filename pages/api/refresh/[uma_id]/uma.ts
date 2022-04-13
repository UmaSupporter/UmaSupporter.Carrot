import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uma_id } = req.query;
  const { API_PASSWORD } = getConfig().serverRuntimeConfig.CONFIG;

  try {
    await axios.post(`https://suppoter.sonagi.dev/ops/new/uma`, {
      root_password: API_PASSWORD,
      new_card_uri: `https://gamewith.jp/uma-musume/article/show/${uma_id}`,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  return res.status(200).end();
}
