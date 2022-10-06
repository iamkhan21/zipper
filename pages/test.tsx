import React from "react";
import data from "@components/home/data.json";
import { Polygon } from "geojson";
import simplify from "@turf/simplify";

const Test = () => {
  React.useEffect(() => {
    const polygon = data.area.geometry as Polygon;
    const simplifiedPoly = simplify(polygon, { tolerance: 0.06 });

    console.log(simplifiedPoly);
    return () => {};
  }, []);

  return <article>Testy</article>;
};

export default Test;
