import React, { useEffect, useRef, useState } from "react";
import type { LngLatLike, Map as MapObject } from "mapbox-gl";
import {
  createSource,
  createSourceFillLayer,
  createSourceLineLayer,
  createSourceSymbolLayer,
  fitToFeatureBounds,
  initiateMap,
  setDataToSource,
} from "@utils/map";
import { $coverageAreas } from "@store/coverage-areas";
import { useStore } from "@nanostores/react";
import { $selectedZips, toggleZip } from "@store/selected-zips";
import { featureCollection, points, Position } from "@turf/helpers";
import { $loader, disableLoader, enableLoader } from "@store/loader";
import { $addresses } from "@store/address";

const MAP_STYLE = process.env.NEXT_PUBLIC_MAPBOX_ZIP_STYLE as string;
const isoSource = "iso";
const zipSource = "zips";
const serviceSource = "services";

const ZipMap = () => {
  const map = useRef<MapObject | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const coverageArea = useStore($coverageAreas);
  const selectedZips = useStore($selectedZips);
  const serviceAddresses = useStore($addresses);
  const loader = useStore($loader);

  useEffect(() => {
    enableLoader("Loading map...");
    (async () => {
      // @ts-ignore
      await import("mapbox-gl/dist/mapbox-gl.css");

      setIsMapLoaded(false);
      map.current?.remove();

      const center: LngLatLike = [-96.064453125, 37.21720617274819];

      map.current = initiateMap("map", center, 4, MAP_STYLE);

      map.current.on("load", async () => {
        if (map.current) {
          map.current.on("click", (event) => {
            const states = map.current?.queryRenderedFeatures(event.point, {
              layers: ["usa-zip-code"],
            });

            const properties = (states || [])[0]?.properties;
            const zipCode = properties?.ZCTA5CE10;

            if (zipCode) {
              toggleZip(zipCode);
            } else {
              alert("This area without zip code");
            }
          });

          createSource(map.current, isoSource);
          createSource(map.current, zipSource);
          createSource(map.current, serviceSource);

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

          const zipColor = "#026401";
          createSourceFillLayer(map.current, zipSource, "zipsFill", {
            color: zipColor,
            opacity: 0.5,
          });
          createSourceLineLayer(map.current, zipSource, "zipsLine", {
            color: zipColor,
            opacity: 1,
            width: 1,
          });

          createSourceSymbolLayer(map.current, serviceSource, "symbols", {
            icon: "place",
            size: 0.5,
            anchor: "bottom",
          });

          disableLoader();
          setIsMapLoaded(true);
        }
      });
    })();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && isMapLoaded) {
      const features = Object.values(coverageArea);
      const areas = featureCollection(features);

      setDataToSource(map.current as MapObject, isoSource, areas);
      features.length && fitToFeatureBounds(map.current as MapObject, areas);
    }
  }, [isMapLoaded, coverageArea]);

  useEffect(() => {
    if (map.current && isMapLoaded) {
      const features = Object.values(selectedZips);
      const zips = featureCollection(features);
      setDataToSource(map.current as MapObject, zipSource, zips);
    }
  }, [isMapLoaded, selectedZips]);

  useEffect(() => {
    if (map.current && isMapLoaded) {
      const services = Object.values(serviceAddresses).map(
        (service) => service.coordinates
      );
      const zips = points(services as Position[]);
      setDataToSource(map.current as MapObject, serviceSource, zips);
    }
  }, [isMapLoaded, serviceAddresses]);

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
              backgroundColor: "rgba(3,112,221,.1)",
              border: "1px solid #0370dd",
            }}
          />
          <p>Zip boundaries</p>
        </div>
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
          <p>Coverage area</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-block",
              height: "15px",
              width: "15px",
              backgroundColor: "rgba(2,100,1,.5)",
              border: "1px solid #026401",
            }}
          />
          <p>Selected zip</p>
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
