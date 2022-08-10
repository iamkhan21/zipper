import { map } from "nanostores";
import { LngLatLike } from "mapbox-gl";
import { nanoid } from "nanoid";
import { disableLoader, enableLoader } from "@store/loader";
import { addCoverageArea, removeCoverageArea } from "@store/coverage-areas";
import wretch from "wretch";
import { createStore, del, entries, set, UseStore } from "idb-keyval";

export type AddressUid = string;

export type Address = {
  address: string;
  time: number;
  coordinates: LngLatLike;
};

let addressesDB: UseStore;

type AddressMap = Record<AddressUid, Address>;

export function loadAddressesFromStorage() {
  addressesDB = createStore("addresses", "addresses");
  entries(addressesDB).then((entries) => {
    const addresses: AddressMap = {};

    for (const [key, value] of entries) {
      addresses[key as string] = value;
    }

    $addresses.set(addresses);
  });
}

export const $addresses = map<AddressMap>({});

export async function addAddress(
  address: string,
  time: number,
  uid: AddressUid = nanoid(10)
) {
  enableLoader("Adding service address...");
  const storedAddress = $addresses.get()[uid];

  try {
    let data: Address;

    if (storedAddress?.address !== address) {
      const results: any = await wretch(`/api/geocoding`)
        .post({ address })
        .json();

      if (results.message) {
        disableLoader();
        return;
      }

      const foundData = results.features[0];

      if (!foundData) {
        disableLoader();
        return;
      }

      data = {
        address: foundData.place_name,
        coordinates: foundData.center,
        time,
      };
    } else {
      data = {
        ...storedAddress,
        time,
      };
    }

    $addresses.setKey(uid, data);
    set(uid, data, addressesDB);
    addCoverageArea(uid, data.coordinates, data.time);
  } catch (e) {
    console.log(e);
    disableLoader();
  }
}

export function removeAddress(uid: AddressUid) {
  const addresses = $addresses.get();

  delete addresses[uid];

  $addresses.set({ ...addresses });
  del(uid, addressesDB);
  removeCoverageArea(uid);
}
