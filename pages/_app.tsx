import "styles/taiwindcss.css";
import "styles/globals.css";
import { useEffect } from "react";
import getConfig from "next/config";
import type { AppProps } from "next/app";
import AlertContextProvider from "contexts/AlertContext";
import LoginContextProvider from "contexts/LoginContext";
import ModalContextProvider from "contexts/ModalContext";

function MyApp({ Component, pageProps }: AppProps) {
  const { publicRuntimeConfig } = getConfig();

  useEffect(() => {
    console.log(`work on: ${publicRuntimeConfig.VERCEL_ENV}`);
    console.log(`git commit: ${publicRuntimeConfig.COMMIT_SHA}`);
  }, [publicRuntimeConfig.COMMIT_SHA, publicRuntimeConfig.VERCEL_ENV]);

  return (
    <AlertContextProvider>
      <ModalContextProvider>
        <LoginContextProvider>
          <Component {...pageProps} />
        </LoginContextProvider>
      </ModalContextProvider>
    </AlertContextProvider>
  );
}

export default MyApp;
