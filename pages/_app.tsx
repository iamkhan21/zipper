import type { AppProps } from "next/app";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";
import "../styles/main.css";
import "windi.css";

function MyApp({ Component, pageProps }: AppProps) {
  const appName = "ZipArea";
  return (
    <NotificationsProvider>
      <Head>
        <title>{appName}</title>
        <meta
          name="description"
          content={`${appName} - help you to handle your service area`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="py-1 px-5 flex items-center gap-2">
        <img src="/logo.svg" width={24} alt="Logo" />
        <h1 className="text-xl font-black">{appName}</h1>
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
    </NotificationsProvider>
  );
}

export default MyApp;
