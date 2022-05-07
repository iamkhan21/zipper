import React, { FC } from "react";
import Head from "next/head";

type Props = {
  appName: string;
};

const Meta: FC<Props> = ({ appName }) => {
  return (
    <Head>
      <title>{appName}</title>
      <meta
        name="description"
        content={`${appName} - help you to handle your service area`}
      />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />
    </Head>
  );
};

export default Meta;
