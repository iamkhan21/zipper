import React, { useEffect, useRef, useState } from "react";
import type { LngLatLike, Map as MapObject } from "mapbox-gl";
import {
  addMapDraw,
  createSource,
  createSourceFillLayer,
  createSourceLineLayer,
  drawMarker,
  fitToFeatureBounds,
  initiateMap,
  setDataToSource,
} from "@utils/map";
import { useStore } from "@nanostores/react";
import { featureCollection } from "@turf/helpers";
import { $loader, disableLoader, enableLoader } from "@store/loader";
import data from "../data.json";
import { Feature, GeoJsonProperties, Geometry, Polygon } from "geojson";
import { Marker } from "mapbox-gl";
import simplify from "@turf/simplify";
import polygonSmooth from "@turf/polygon-smooth";

const isoSource = "iso";

const ZipMap = () => {
  const map = useRef<MapObject | null>(null);
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
      const Draw = addMapDraw(map.current);

      const polygon = data.area.geometry as Polygon;
      const simplified = simplify(polygon, { tolerance: 0.06 });
        const smoothed = polygonSmooth(simplified, { iterations: 1 });
      Draw.add(smoothed);

      map.current.on("draw.modechange", (e) => {
        const data = Draw.getAll();
        if (Draw.getMode() == "draw_polygon") {
          const pids: any[] = [];

          // ID of the added template empty feature
          const lid = data.features[data.features.length - 1].id;

          data.features.forEach((f) => {
            if (f.geometry.type === "Polygon" && f.id !== lid) {
              pids.push(f.id);
            }
          });

          Draw.delete(pids);
        }
      });

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
      features.length && fitToFeatureBounds(map.current as MapObject, areas);
    }
  }, [isMapLoaded]);

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
