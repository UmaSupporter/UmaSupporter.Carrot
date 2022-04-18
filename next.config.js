const production = process.env.VERCEL_ENV === "production";
const VERCEL_ENV = process.env.VERCEL_ENV || "local";

function getExcludedConsole() {
  const excluded = ["error"];

  if (!production) {
    excluded.push("log");
    excluded.push("warn");
    excluded.push("dir");
    excluded.push("info");
    excluded.push("debug");
  }

  return excluded;
}

const HOST = process.env.VERCEL
  ? ""
  : `${process.env.HTTPS ? "https" : "http"}://${process.env.HOST || "localhost:3000"}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: {
      exclude: getExcludedConsole(),
    },
  },
  env: {
    production,
  },
  serverRuntimeConfig: {
    CONFIG: {
      API_HOST: HOST || "",
      API_PASSWORD: process.env.API_PASSWORD,
      adminId: process.env.ADMIN_ID,
      adminPw: process.env.ADMIN_PW,
    },
    AWS: {
      region: process.env.AWS_S3_REGION,
      Bucket: process.env.AWS_S3_BUCKET,
      path: process.env.AWS_S3_PATH,
      accessKeyId: process.env.AWS_S3_ACCESS_ID,
      secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
    },
  },
  publicRuntimeConfig: {
    VERCEL_ENV,
    COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || "local-development",
    CONFIG: {
      API_PASSWORD: process.env.API_PASSWORD,
      API_HOST: HOST || "",
    },
  },
};

module.exports = nextConfig;
