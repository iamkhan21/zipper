import React from "react";
import style from "./style.module.css";

const Loader = () => {
  return (
    <section className="text-center">
      <h2 className="mb-4 text-2xl font-bold">ZipArea</h2>
      <div className={style.loader} />
    </section>
  );
};

export default Loader;
