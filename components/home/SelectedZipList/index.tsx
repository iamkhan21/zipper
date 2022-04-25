import React from "react";
import { useStore } from "@nanostores/react";
import {
  $selectedZips,
  removeZipFromSelected,
  selectAllInCoveredArea,
} from "@store/selected-zips";
import { $loader } from "@store/loader";

function remove(zip: string) {
  return () => removeZipFromSelected(zip);
}

const SelectedZipList = () => {
  const selectedZips = useStore($selectedZips);
  const loader = useStore($loader);

  const zips = Object.keys(selectedZips);
  return (
    <aside className="ml-5 flex-1">
      <section className="flex items-center justify-between">
        <h3 className="font-bold">Selected Zips: {zips.length}</h3>
        <button
          className="px-6 py-2 border border-blue-500 font-medium text-sm hover:bg-blue-600 hover:text-blue-100 text-blue-600 rounded"
          onClick={selectAllInCoveredArea}
          disabled={!!loader}
        >
          Select all in area
        </button>
      </section>
      <section className="py-5">
        <ul className="max-h-70vh overflow-y-auto pr-5">
          {zips.map((zip) => (
            <li key={zip} className="flex items-center justify-between mb-2">
              <b>{zip}</b>
              <button
                className="px-2 py-1 bg-red-500 font-medium text-sm hover:bg-red-600 text-red-100 rounded"
                onClick={remove(zip)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default SelectedZipList;
