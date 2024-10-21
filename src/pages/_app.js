import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Customer Web App</title>
        <meta name="description" content="Customer PWA" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fff" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
