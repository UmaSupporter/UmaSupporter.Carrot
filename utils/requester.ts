import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const instance = axios.create({
  baseURL: `${publicRuntimeConfig.CONFIG.API_HOST || serverRuntimeConfig.CONFIG.API_HOST}/api`,
});

export default instance;
