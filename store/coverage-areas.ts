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

export const $coverageAreas = map<
  Record<AddressUid, Feature<Geometry, GeoJsonProperties>>
>({});

export async function addCoverageArea(
  uid: AddressUid,
  point: LngLatLike,
  time: number
) {
  enableLoader("Loading coverage area...");
  const [lng, lat] = point as [number, number];

  try {
    const data = await wretch(
      `/api/coverage?lng=${lng}&lat=${lat}&time=${time}`
    )
      .get()
      .json();

    if (data.message) {
      disableLoader();
      return;
    }

    $coverageAreas.setKey(
      uid,
      (data as FeatureCollection<Geometry, GeoJsonProperties>).features[0]
    );
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
}
