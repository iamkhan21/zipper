import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/main.css";
import "windi.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Zipper</title>
        <meta
          name="description"
          content="Zipper - help you to see service area"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="px-5">
        <h1 className="text-xl font-black">Zipper</h1>
      </header>
      <main className="p-5">
        <Component {...pageProps} />
      </main>
      <footer className="px-5">
        <small>
          Created by{" "}
          <a
            href="https://www.8byte.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            8byte Agency
          </a>
        </small>
      </footer>
    </>
  );
}

export default MyApp;
