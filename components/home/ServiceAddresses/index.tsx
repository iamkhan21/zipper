import React from "react";
import AddressForm from "@components/shared/AddressForm";
import { useStore } from "@nanostores/react";
import { $addresses } from "@store/address";

const ServiceAddresses = () => {
  const addresses = useStore($addresses);
  return (
    <section>
      <h3 className="font-bold">Service Addresses</h3>
      <AddressForm />
      <section className="h-15vh overflow-y-auto pr-1">
        {Object.entries(addresses).map(([uid, { address, time }]) => (
          <AddressForm key={uid} address={address} time={time} uid={uid} />
        ))}
      </section>
    </section>
  );
};

export default ServiceAddresses;
