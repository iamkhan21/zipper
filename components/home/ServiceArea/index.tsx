import React from "react";
import { useStore } from "@nanostores/react";
import {
  $selectedZips,
  clearSelected,
  removeZipFromSelected,
  selectAllInCoveredArea,
} from "@store/selected-zips";
import { $loader } from "@store/loader";
import { Button, List } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { $coverageAreas } from "@store/coverage-areas";

function remove(zip: string) {
  return () => removeZipFromSelected(zip);
}

function copyZips() {
  const zips = Object.keys($selectedZips.get()).join(", ");

  navigator.clipboard.writeText(zips).then(() => {
    showNotification({
      color: "green",
      title: "Copied!",
      message: "All selected zip codes were copied to your clipboard.",
    });
  });
}

const ServiceArea = () => {
  const selectedZips = useStore($selectedZips);
  const coveredAreas = useStore($coverageAreas);

  const zips = Object.keys(selectedZips);
  const areas = Object.keys(coveredAreas);
  const isZipsSelected = !!zips.length;
  const isAreasSelected = !!areas.length;

  return (
    <section className="space-y-5">
      <section className="flex items-center justify-between">
        <h3 className="font-bold">Service Area ({zips.length})</h3>
        <div className="flex gap-1">
          <Button
            compact
            variant="outline"
            onClick={selectAllInCoveredArea}
            disabled={!isAreasSelected}
          >
            Select all in area
          </Button>
          <Button
            compact
            color="red"
            variant="outline"
            onClick={clearSelected}
            disabled={!isZipsSelected}
          >
            Clear
          </Button>
        </div>
      </section>
      <section className="h-40vh overflow-y-auto pr-1">
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
      {isZipsSelected && (
        <section>
          <Button fullWidth color="green" onClick={copyZips}>
            Copy all selected zip codes
          </Button>
        </section>
      )}
    </section>
  );
};

export default ServiceArea;

// 1945 South Military Highway, Chesapeake
// 4891 Nine Mile Road, Richmond
