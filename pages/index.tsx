import type { NextPage } from "next";
import ZipMap from "@components/home/ZipMap";
import ServiceArea from "@components/home/ServiceArea";
import ServiceAddresses from "@components/home/ServiceAddresses";

const Home: NextPage = () => {
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
