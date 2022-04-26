import React from "react";
import AddressForm from "@components/shared/AddressForm";
import { useStore } from "@nanostores/react";
import { $addresses } from "@store/address";

const ServiceAddresses = () => {
  const addresses = useStore($addresses);
  return (
    <section>
      <h3 className="font-bold">Service Addresses</h3>
      <p className="leading-tight">
        <small>
            Enter your address in&nbsp;the input box below. <br />
            The second entry is&nbsp;the time in&nbsp;minutes to&nbsp;create <br/>
            an&nbsp;availability zone for your business.
        </small>
      </p>
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
