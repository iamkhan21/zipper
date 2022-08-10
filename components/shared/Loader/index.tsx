import React from "react";
import style from "./style.module.css";

const Loader = () => {
  return (
    <section className="text-center">
      <img src="/images/logo.svg" height={128} alt="Logo" />
      <br />
      <div className={style.loader} />
    </section>
  );
};

export default Loader;
