import { atom } from "nanostores";
import { Feature, Polygon } from "geojson";
import { disableLoader, enableLoader } from "@store/loader";
import { get, set } from "idb-keyval";
import data from "@components/home/data.json";
import { supabase } from "@lib/supabase";
import { covertGeometryToString } from "@utils/converters";

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
    selectZipsInCoveredArea(area as unknown as Feature<Polygon>);
  }
}

export async function selectZipsInCoveredArea(area: Feature<Polygon>) {
  enableLoader("Saving coverage area...");

  const { data, error } = await supabase.rpc("find_zips_in_polygon", {
    poly: covertGeometryToString(area.geometry.coordinates[0]),
  });

  if (data) {
    alert(`${data.length} zips inside selected area`);
    console.log(data);
  }

  disableLoader();
}
