import { atom } from "nanostores";
import { Polygon } from "geojson";
import { disableLoader, enableLoader } from "@store/loader";
import { get, set } from "idb-keyval";
import data from "@components/home/data.json";
import bbox from "@turf/bbox";
import { supabase } from "@lib/supabase";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

type Coverage = Polygon | null;
const selectedCoverageKey = "selected-coverage";
export const $selectedCoverage = atom<Coverage>(null);

export function setCoverage(coverage: Coverage) {
  $selectedCoverage.set(coverage);
}

export async function fetchCoverage() {
  const coverage =
    (await get(selectedCoverageKey)) || (data.coverage as Polygon);
  setCoverage(coverage);
  return coverage;
}

export function saveSelectedCoverage() {
  const area = $selectedCoverage.get();
  if (area) {
    set(selectedCoverageKey, area);
    selectZipsInCoveredArea(area);
  }
}

export async function selectZipsInCoveredArea(area: Polygon) {
  enableLoader("Saving coverage area...");
  const [minLng, minLat, maxLng, maxLat] = bbox(area);

  const res = await supabase
    .from("zipcodes")
    .select()
    .gte("lng", minLng)
    .gte("lat", minLat)
    .lte("lng", maxLng)
    .lte("lat", maxLat);

  if (res.data) {
    const insideZone = res.data.filter(({ lng, lat }) =>
      booleanPointInPolygon([lng, lat], area)
    );

    alert(`${insideZone.length} zips inside selected area`);
  }

  disableLoader();
}
