import React from "react";
import data from "../data.json";

const ServiceAddresses = () => {
  return (
    <section>
      <h3 className="text-lg font-bold">Service Addresses</h3>
      <p className="leading-tight">{data.service.address}</p>
    </section>
  );
};

export default ServiceAddresses;
