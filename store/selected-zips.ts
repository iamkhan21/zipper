import { map } from "nanostores";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { $coverageArea } from "@store/coverage-area";
import { FeatureCollection } from "@turf/helpers";
import wretch from "wretch";
import { $loader, disableLoader, enableLoader } from "@store/loader";

export const $selectedZips = map<
  Record<string, Feature<Geometry, GeoJsonProperties>>
>({});

export async function addZipsToSelected(zips: string[]) {
  enableLoader("Loading zips boundaries...");

  const boundaries = await wretch(`/api/boundaries`).post({ zips }).json();

  (boundaries as Feature<Geometry>[]).forEach((zipBoundaries) => {
    $selectedZips.setKey(
      zipBoundaries.properties?.code as string,
      zipBoundaries
    );
  });

  setTimeout(() => {
    $loader.get() && disableLoader();
  }, 300);
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
  enableLoader("Looking for zips in covered area...");
  const coveredArea = $coverageArea.get();

  const points = await wretch(`/api/zips-in-area`).post(coveredArea).json();

  const zips = (points as FeatureCollection<Geometry>).features.map((zip) => {
    return zip.properties?.code as string;
  });

  addZipsToSelected(zips);
}
