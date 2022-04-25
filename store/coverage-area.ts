import { atom } from "nanostores";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { LngLatLike } from "mapbox-gl";
import wretch from "wretch";
import { disableLoader, enableLoader } from "@store/loader";

export const $coverageArea = atom<FeatureCollection<
  Geometry,
  GeoJsonProperties
> | null>(null);

export async function loadCoverageArea(point: LngLatLike) {
  enableLoader("Loading coverage area...");
  const [lng, lat] = point as [number, number];
  try {
    const data = await wretch(`/api/coverage?lng=${lng}&lat=${lat}`)
      .get()
      .json();

    if (data.message) return;

    $coverageArea.set(data as FeatureCollection<Geometry, GeoJsonProperties>);
  } catch (e) {
    console.log(e);
  } finally {
    disableLoader();
  }
}
