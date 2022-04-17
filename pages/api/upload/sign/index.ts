import { NextApiRequest, NextApiResponse } from "next";
import { s3Client } from "libs/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getConfig from "next/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { Bucket, path } = getConfig().serverRuntimeConfig.AWS;
  const { filename } = req.query;

  const command = new PutObjectCommand({
    Bucket,
    Key: `${path}/${filename}`,
    Body: "",
  });

  const endpoint = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return res.status(201).json({
    endpoint,
  });
}
