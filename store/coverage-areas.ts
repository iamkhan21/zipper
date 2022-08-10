import { map } from "nanostores";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { LngLatLike } from "mapbox-gl";
import wretch from "wretch";
import { disableLoader, enableLoader } from "@store/loader";
import { AddressUid } from "@store/address";
import { createStore, del, entries, set, UseStore } from "idb-keyval";

let coverageDB: UseStore;

type CoverageMap = Record<AddressUid, Feature<Geometry, GeoJsonProperties>>;

export const $coverageAreas = map<CoverageMap>({});

export function loadCoverageAreasFromStorage() {
  coverageDB = createStore("coverage", "coverage");
  entries(coverageDB).then((entries) => {
    const coverageAreas: CoverageMap = {};

    for (const [key, value] of entries) {
      coverageAreas[key as string] = value;
    }

    $coverageAreas.set(coverageAreas);
  });
}

export async function addCoverageArea(
  uid: AddressUid,
  point: LngLatLike,
  time: number
) {
  enableLoader("Loading coverage area...");
  const [lng, lat] = point as [number, number];

  try {
    const data: any = await wretch(
      `/api/coverage?lng=${lng}&lat=${lat}&time=${time}`
    )
      .get()
      .json();

    if (data.message) {
      disableLoader();
      return;
    }

    const feature = (data as FeatureCollection<Geometry, GeoJsonProperties>)
      .features[0];
    $coverageAreas.setKey(uid, feature);
    set(uid, feature, coverageDB);
  } catch (e) {
    console.log(e);
  } finally {
    disableLoader();
  }
}

export function removeCoverageArea(uid: AddressUid) {
  const areas = $coverageAreas.get();

  delete areas[uid];

  $coverageAreas.set({ ...areas });
  del(uid, coverageDB);
}
