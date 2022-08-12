import React from "react";
import {
  $selectedCoverage,
  saveSelectedCoverage,
} from "@store/selected-coverage";
import { Button } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { $loader } from "@store/loader";

const SaveCoverage = () => {
  const coverageLoaded = React.useRef(false);
  const loader = useStore($loader);
  const coverage = useStore($selectedCoverage);
  const [isCoverageUpdated, setIsCoverageUpdated] = React.useState(false);

  React.useEffect(() => {
    if (coverage) {
      if (coverageLoaded.current) {
        setIsCoverageUpdated(true);
      } else {
        coverageLoaded.current = true;
      }
    }
  }, [coverage]);

  function save() {
    saveSelectedCoverage();
    setIsCoverageUpdated(false);
  }

  return (
    <Button
      onClick={save}
      disabled={!!loader || !coverage || !isCoverageUpdated}
    >
      Save coverage area
    </Button>
  );
};

export default SaveCoverage;
