import React from "react";
import { useStore } from "@nanostores/react";
import {
  $selectedZips,
  removeZipFromSelected,
  selectAllInCoveredArea,
} from "@store/selected-zips";
import { $loader } from "@store/loader";
import { Button } from "@mantine/core";
import { List } from "@mantine/core";
import { Trash } from "tabler-icons-react";

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
        <Button
            compact
          variant="outline"
          onClick={selectAllInCoveredArea}
          disabled={!!loader}
        >
          Select zips in area
        </Button>
      </section>
      <section className="max-h-80vh overflow-y-auto mt-5 pr-5">
        <List listStyleType="none">
          {zips.map((zip) => (
            <List.Item key={zip}>
              <div className="flex items-center justify-between mb-2">
                <b>{zip}</b>
                <Button
                  variant="subtle"
                  color="red"
                  compact
                  onClick={remove(zip)}
                >
                  <Trash color="red" />
                </Button>
              </div>
            </List.Item>
          ))}
        </List>
      </section>
    </aside>
  );
};

export default SelectedZipList;
