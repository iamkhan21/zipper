import React from "react";
import style from "./style.module.css";
import Image from "next/image";

const Loader = () => {
  return (
    <section className="text-center">
      <Image src="/images/logo.svg" height={128} alt="Logo" />
      <br />
      <div className={style.loader} />
    </section>
  );
};

export default Loader;
