import React, { useEffect, useRef, useState } from "react";
import type { LngLatLike, Map as MapObject } from "mapbox-gl";
import { Marker } from "mapbox-gl";
import {
    addMapDraw,
    createSource,
    createSourceFillLayer,
    createSourceLineLayer,
    drawMarker, FeatureData,
    fitToFeatureBounds,
    initiateMap,
    setDataToSource,
} from "@utils/map";
import { useStore } from "@nanostores/react";
import { featureCollection } from "@turf/helpers";
import { $loader, disableLoader, enableLoader } from "@store/loader";
import data from "../data.json";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import simplify from "@turf/simplify";
import cleanCoords from "@turf/clean-coords";
import {
  $selectedCoverage,
  fetchCoverage,
  setCoverage,
} from "@store/selected-coverage";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const isoSource = "iso";

const ZipMap = () => {
  const map = useRef<MapObject | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const loader = useStore($loader);

  useEffect(() => {
    let marker: Marker | null;

    enableLoader("Loading map...");
    (async () => {
      // @ts-ignore
      await import("mapbox-gl/dist/mapbox-gl.css");
      // @ts-ignore
      await import("@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css");

      setIsMapLoaded(false);
      map.current?.remove();

      const center: LngLatLike = [-96.064453125, 37.21720617274819];

      map.current = initiateMap("map", center, 4);

      map.current.on("draw.modechange", () => {
        const data = draw.current?.getAll();
        if (data && draw.current?.getMode() == "draw_polygon") {
          const pids: any[] = [];

          // ID of the added template empty feature
          const lid = data.features[data.features.length - 1].id;

          data.features.forEach((f) => {
            if (f.geometry.type === "Polygon" && f.id !== lid) {
              pids.push(f.id);
            }
          });

          draw.current.delete(pids);
          setCoverage(null);
        }
      });

      map.current.on("draw.create", setOptimizeArea);
      map.current.on("draw.delete", () => setCoverage(null));
      map.current.on("draw.update", setOptimizeArea);

      map.current.on("load", async () => {
        if (map.current) {
          const service = data.service.coordinates;
          marker = drawMarker(map.current as MapObject, service as LngLatLike, {
            color: "#444",
          });

          createSource(map.current, isoSource);

          const isoColor = "#ff7100";
          createSourceFillLayer(map.current, isoSource, "isoFill", {
            color: isoColor,
            opacity: 0.25,
          });

          createSourceLineLayer(map.current, isoSource, "isoLine", {
            color: isoColor,
            opacity: 1,
            width: 1,
          });

          draw.current = addMapDraw(map.current);
          draw.current.add(await fetchCoverage());

          disableLoader();
          setIsMapLoaded(true);
        }
      });
    })();

    return () => {
      marker?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && isMapLoaded) {
      const features = [data.area as Feature<Geometry, GeoJsonProperties>];
      const areas = featureCollection(features);

      setDataToSource(map.current as MapObject, isoSource, areas);
      const coverage = $selectedCoverage.get();
      coverage && fitToFeatureBounds(map.current as MapObject, coverage);
    }
  }, [isMapLoaded]);

  function setOptimizeArea() {
    const data = draw.current?.getAll();
    const cleaned = cleanCoords(data?.features[0]);
    setCoverage(simplify(cleaned, { tolerance: 0.01 }));
  }

  return (
    <>
      <section style={{ height: "100%", width: "100%" }} id="map" />

      <section className="absolute bottom-10 right-5 bg-white p-2">
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              height: "15px",
              width: "15px",
              backgroundColor: "rgba(255,113,0,.25)",
              border: "1px solid #ff7100",
            }}
          />
          <p>Coverage area ({data.service.time} mins)</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              height: "15px",
              width: "15px",
              backgroundColor: "rgba(2,100,1,.25)",
              border: "1px solid #026401",
            }}
          />
          <p>Selected coverage area</p>
        </div>
      </section>

      {loader && (
        <section className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/50">
          <h1 className="text-lg font-bold">{loader}</h1>
        </section>
      )}
    </>
  );
};

export default ZipMap;
