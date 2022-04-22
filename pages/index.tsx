import type { NextPage } from "next";
import ZipMap from "../components/home/ZipMap";
import SelectedZipList from "@components/home/SelectedZipList";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const [isSSR, setIsSSR] = useState(true);

  const {
    query: { lng = -77.05977034007392, lat = 38.82251558482062 },
    isReady,
  } = router;

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <article className="flex h-full">
      {!isSSR && isReady && <ZipMap lng={+lng} lat={+lat} />}
      <SelectedZipList />
    </article>
  );
};

export default Home;
