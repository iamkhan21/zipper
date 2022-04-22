import { atom } from "nanostores";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { LngLatLike } from "mapbox-gl";
import wretch from "wretch";

export const $coverageArea = atom<FeatureCollection<
  Geometry,
  GeoJsonProperties
> | null>(null);

export async function loadCoverageArea(point: LngLatLike) {
  const [lng, lat] = point as [number, number];
  try {
    const data = await wretch(`/api/coverage?lng=${lng}&lat=${lat}`)
      .get()
      .json();
    $coverageArea.set(data as FeatureCollection<Geometry, GeoJsonProperties>);
  } catch (e) {
    console.log(e);
  }
}
