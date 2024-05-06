import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { env } from "process";
import { ReactElement } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "src/core/loading";
import ApiLoadingHandler from "src/core/providers/ApiLoadingHandler";
import RouteLoadingHandler from "src/core/providers/RouteLoadingHandler";
import AuthProvider from "src/providers/AuthProvider";
import ErrorHandler from "src/providers/ErrorHandler";
import LanguageHandler from "src/providers/LanguageHandler";
import store from "src/redux";
import "src/styles/globals.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CustomAppProps extends Omit<AppProps, "Component"> {
  Component: PageComponent;
  data: any;
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const getLayout = Component.getLayout || ((page: ReactElement) => page);
  return (
    <ConfigProvider>
      <Head>
        <title>{env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <SessionProvider session={session}>
        <LoadingProvider>
          <RouteLoadingHandler>
            <ApiLoadingHandler>
              <ErrorHandler error={pageProps.error}>
                <AuthProvider>
                  <LanguageHandler>
                    <NextNProgress />
                    <ToastContainer />
                    <Provider store={store}>
                      {getLayout(<Component {...pageProps} />)}
                    </Provider>
                  </LanguageHandler>
                </AuthProvider>
              </ErrorHandler>
            </ApiLoadingHandler>
          </RouteLoadingHandler>
        </LoadingProvider>
      </SessionProvider>
    </ConfigProvider>
  );
}

export default appWithTranslation(MyApp);
