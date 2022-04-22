import { map } from "nanostores";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { $coverageArea } from "@store/coverage-area";
import { FeatureCollection } from "@turf/helpers";
import wretch from "wretch";

export const $selectedZips = map<
  Record<string, Feature<Geometry, GeoJsonProperties>>
>({});

export async function addZipsToSelected(zips: string[]) {
  const boundaries = await wretch(`/api/boundaries`).post({ zips }).json();

  (boundaries as Feature<Geometry>[]).forEach((zipBoundaries) => {
    $selectedZips.setKey(
      zipBoundaries.properties?.code as string,
      zipBoundaries
    );
  });
}

export function removeZipFromSelected(zip: string) {
  const selected = $selectedZips.get();

  delete selected[zip];

  $selectedZips.set({ ...selected });
}

export function toggleZip(zip: string) {
  if ($selectedZips.get()[zip]) {
    removeZipFromSelected(zip);
  } else {
    addZipsToSelected([zip]);
  }
}

export async function selectAllInCoveredArea() {
  const coveredArea = $coverageArea.get();

  const points = await wretch(`/api/zips-in-area`).post(coveredArea).json();

  const zips = (points as FeatureCollection<Geometry>).features.map((zip) => {
    return zip.properties?.code as string;
  });

  addZipsToSelected(zips);
}
