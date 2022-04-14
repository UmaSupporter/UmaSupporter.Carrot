import axios from "axios";
import getConfig from "next/config";
import { getCookie } from "cookies-next";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const token = getCookie("token");

const instance = axios.create({
  baseURL: `${publicRuntimeConfig.CONFIG.API_HOST ?? serverRuntimeConfig.CONFIG.API_HOST}/api`,
  headers: {
    Authorization: token ? `Bearer ${token}` : ``,
  },
});

export default instance;
