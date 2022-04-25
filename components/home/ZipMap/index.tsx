import React, { FC, useEffect, useRef, useState } from "react";
import type { LngLatLike, Map as MapObject } from "mapbox-gl";
import {
  createSource,
  createSourceFillLayer,
  createSourceLineLayer,
  fitToFeatureBounds,
  initiateMap,
  setDataToSource,
} from "@utils/map";
import { $coverageArea, loadCoverageArea } from "@store/coverage-area";
import { useStore } from "@nanostores/react";
import { $selectedZips, toggleZip } from "@store/selected-zips";
import { featureCollection } from "@turf/helpers";
import { $loader, enableLoader } from "@store/loader";

type Props = {
  lng: number;
  lat: number;
};

const ZipMap: FC<Props> = ({ lng, lat }) => {
  const isoSource = "iso";
  const zipSource = "zips";

  const map = useRef<MapObject | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const coverageArea = useStore($coverageArea);
  const selectedZips = useStore($selectedZips);
  const loader = useStore($loader);

  useEffect(() => {
    if (lat && lng) {
      enableLoader("Loading map...");
      (async () => {
        // @ts-ignore
        await import("mapbox-gl/dist/mapbox-gl.css");

        setIsMapLoaded(false);
        map.current?.remove();

        const center: LngLatLike = [lng, lat];

        map.current = initiateMap("map", center);

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

            await loadCoverageArea(center);
            setIsMapLoaded(true);
          }
        });
      })();
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && isMapLoaded && coverageArea) {
      setDataToSource(map.current as MapObject, isoSource, coverageArea);
      fitToFeatureBounds(map.current as MapObject, coverageArea);
    }
  }, [isMapLoaded, coverageArea]);

  useEffect(() => {
    if (map.current && isMapLoaded) {
      const zips = featureCollection(
        Array.from(Object.values(selectedZips) || [])
      );
      setDataToSource(map.current as MapObject, zipSource, zips);
    }
  }, [isMapLoaded, selectedZips]);

  return (
    <section className="relative w-75vw flex flex-col items-center justify-center">
      <section style={{ height: "100%", width: "100%" }} id="map" />
      {loader && (
        <section className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/50">
          <h1 className="text-lg font-bold">{loader}</h1>
        </section>
      )}
    </section>
  );
};

export default ZipMap;
