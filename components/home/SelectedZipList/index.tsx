import React from "react";
import { useStore } from "@nanostores/react";
import {
  $selectedZips,
  removeZipFromSelected,
  selectAllInCoveredArea,
} from "@store/selected-zips";

function remove(zip: string) {
  return () => removeZipFromSelected(zip);
}

const SelectedZipList = () => {
  const selectedZips = useStore($selectedZips);

  const zips = Object.keys(selectedZips);
  return (
    <aside className="ml-5 flex-1">
      <section className="flex items-center justify-between">
        <h3 className="font-bold">Selected Zips: {zips.length}</h3>
        <button onClick={selectAllInCoveredArea}>Select all in area</button>
      </section>
      <section className="py-5">
        <ul className="max-h-70vh overflow-y-auto">
          {zips.map((zip) => (
            <li key={zip} className="flex items-center justify-between">
              <b>{zip}</b>
              <button className="p-1" onClick={remove(zip)}>
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
