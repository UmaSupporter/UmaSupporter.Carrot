import { NextApiRequest, NextApiResponse } from "next";
import { s3Client } from "libs/s3Client";
import { NotFound } from "@aws-sdk/client-s3";
import getConfig from "next/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const { Bucket, path } = getConfig().serverRuntimeConfig.AWS;

  const { filename } = req.query;
  let exists = false;

  try {
    const response = await s3Client.headObject({
      Bucket,
      Key: `${path}/${filename}`,
    });
    if (response.$metadata.httpStatusCode === 200) exists = true;
  } catch (e) {
    if (!(e instanceof NotFound)) {
      console.error(e);
      throw e;
    }
  } finally {
    res.status(200).json({
      exists,
    });
  }
}
