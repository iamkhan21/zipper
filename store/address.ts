import { map } from "nanostores";
import { LngLatLike } from "mapbox-gl";
import { nanoid } from "nanoid";
import { disableLoader, enableLoader } from "@store/loader";
import { addCoverageArea, removeCoverageArea } from "@store/coverage-areas";
import wretch from "wretch";

export type AddressUid = string;

export type Address = {
  address: string;
  time: number;
  coordinates: LngLatLike;
};

export const $addresses = map<Record<AddressUid, Address>>({});

export async function addAddress(
  address: string,
  time: number,
  uid: AddressUid = nanoid(10)
) {
  enableLoader("Adding service address...");

  try {
    const results = await wretch(`/api/geocoding`).post({ address }).json();

    if (results.message) {
      disableLoader();
      return;
    }

    const foundData = results.features[0];

    if (!foundData) {
      disableLoader();
      return;
    }
    console.log(foundData);
    const data: Address = {
      address: foundData.place_name,
      coordinates: foundData.center,
      time,
    };

    $addresses.setKey(uid, data);
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
  removeCoverageArea(uid);
}
