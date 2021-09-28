import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NotasContextProvider } from "@store/notas-context";
import Layout from "@components/layout/Layout";
import { StockContextProvider } from "@store/stock-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Gimbo | Dashboard Investimentos</title>
      </Head>
      <NotasContextProvider>
        <StockContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StockContextProvider>
      </NotasContextProvider>
    </>
  );
}
export default MyApp;
