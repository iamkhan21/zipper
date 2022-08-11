import React from "react";
import {
  $selectedCoverage,
  saveSelectedCoverage,
} from "@store/selected-coverage";
import { Button } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { $loader } from "@store/loader";

const SaveCoverage = () => {
  const loader = useStore($loader);
  const coverage = useStore($selectedCoverage);

  return (
    <Button onClick={saveSelectedCoverage} disabled={!!loader || !coverage}>
      Save coverage area
    </Button>
  );
};

export default SaveCoverage;
