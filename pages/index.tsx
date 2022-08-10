import type { NextPage } from "next";
import Map from "@components/home/Map";
import ServiceAddresses from "@components/home/ServiceAddresses";
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
        <Map />
      </section>
      <aside className="ml-5 basis-90 space-y-5">
        <ServiceAddresses />
      </aside>
    </article>
  );
};

export default Home;
