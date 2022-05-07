import type { AppProps } from "next/app";
import { NotificationsProvider } from "@mantine/notifications";
import Footer from "@components/core/Footer";
import Meta from "@components/core/Meta";
import Header from "@components/core/Header";
import AuthWrap from "@components/core/AuthWrap";
import "@styles/main.css";
import "windi.css";

function MyApp({ Component, pageProps }: AppProps) {
  const appName = "ZipArea";

  return (
    <NotificationsProvider>
      <Meta appName={appName} /> <Header appName={appName} />
      <main className="p-5">
        <AuthWrap>
          <Component {...pageProps} />
        </AuthWrap>
      </main>
      <Footer />
    </NotificationsProvider>
  );
}

export default MyApp;
