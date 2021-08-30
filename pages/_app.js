import Head from "next/head";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Gimbo | Dashboard Investimentos</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
