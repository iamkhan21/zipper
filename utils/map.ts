import type { LngLatLike, Map } from "mapbox-gl";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import bbox from "@turf/bbox";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

export function initiateMap(
  containerId: string,
  center: LngLatLike,
  zoom: number
): Map {
  return new mapboxgl.Map({
    container: containerId,
    style: "mapbox://styles/onexel/cl1ruw4st002h14o0ioafsexk",
    center,
    zoom,
    maxZoom: 15,
    minZoom: 4,
  });
}

export function createSource(map: Map, sourceName: string) {
  map.addSource(sourceName, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
}

export type FillOptions = {
  color: string;
  opacity: number;
};

export function createSourceFillLayer(
  map: Map,
  sourceName: string,
  id: string,
  { color, opacity }: FillOptions
) {
  map.addLayer({
    id,
    type: "fill",
    source: sourceName,
    paint: {
      "fill-color": color,
      "fill-opacity": opacity,
    },
  });
}

export type SymbolOptions = {
  icon: string;
  size: number;
};

export function createSourceSymbolLayer(
  map: Map,
  sourceName: string,
  id: string,
  { size, icon }: SymbolOptions
) {
  map.addLayer({
    id,
    type: "symbol",
    source: sourceName,
    layout: {
      "icon-image": icon,
      "icon-size": size,
    },
  });
}

export type LineOptions = {
  color: string;
  opacity: number;
  width: number;
};

export function createSourceLineLayer(
  map: Map,
  sourceName: string,
  id: string,
  { color, opacity, width }: LineOptions
) {
  map.addLayer({
    id,
    type: "line",
    source: sourceName,
    paint: {
      "line-color": color,
      "line-opacity": opacity,
      "line-width": width,
    },
  });
}

export type FeatureData =
  | Feature<Geometry, GeoJsonProperties>
  | FeatureCollection<Geometry, GeoJsonProperties>;

export function setDataToSource(
  map: Map,
  sourceName: string,
  data: FeatureData
) {
  (map.getSource(sourceName) as GeoJSONSource).setData(data);
}

export function fitToFeatureBounds(map: Map, data: FeatureData) {
  const bounds = bbox(data);
  map.fitBounds(
    [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    { padding: 15 }
  );
}
