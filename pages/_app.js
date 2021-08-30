import Head from "next/head";
import "tailwindcss/tailwind.css";
import { NotasContextProvider } from "../store/notas-context";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Gimbo | Dashboard Investimentos</title>
      </Head>
      <NotasContextProvider>
        <Component {...pageProps} />
      </NotasContextProvider>
    </>
  );
}

export default MyApp;
