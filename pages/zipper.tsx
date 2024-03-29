import type { NextPage } from "next";
import ZipMap from "@components/zipper/ZipMap";
import ServiceArea from "@components/zipper/ServiceArea";
import ServiceAddresses from "@components/zipper/ServiceAddresses";
import { loadAddressesFromStorage } from "@store/address";
import { useEffect } from "react";
import { loadCoverageAreasFromStorage } from "@store/coverage-areas";

const Home: NextPage = () => {
  useEffect(() => {
    loadCoverageAreasFromStorage();
    loadAddressesFromStorage();
  }, []);

  return (
    <article className="flex h-full">
      <section className="relative flex-1 flex flex-col items-center justify-center">
        <ZipMap />
      </section>
      <aside className="ml-5 basis-90 space-y-5">
        <ServiceAddresses />
        <ServiceArea />
      </aside>
    </article>
  );
};

export default Home;
