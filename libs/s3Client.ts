import { S3 } from "@aws-sdk/client-s3";
import getConfig from "next/config";

const { region, accessKeyId, secretAccessKey } = getConfig().serverRuntimeConfig.AWS;

export const s3Client = new S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
