import type { Anchor, LngLatLike, Map } from "mapbox-gl";
import mapboxgl, { GeoJSONSource, Marker, MarkerOptions } from "mapbox-gl";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import bbox from "@turf/bbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import drawStyles from "@data/map-draw-styles.json";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

export function initiateMap(
  containerId: string,
  center: LngLatLike,
  zoom: number,
  style = "mapbox://styles/mapbox/streets-v11"
): Map {
  return new mapboxgl.Map({
    container: containerId,
    style,
    center,
    zoom,
    maxZoom: 15,
    minZoom: 4,
  });
}

export function addMapDraw(map: Map) {
  const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
      polygon: true,
      trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: "simple_select",
    styles: drawStyles,
  });
  map.addControl(draw);

  return draw;
}

export function drawMarker(
  map: Map,
  coordinates: LngLatLike,
  options: MarkerOptions = {}
): Marker {
  return new mapboxgl.Marker(options).setLngLat(coordinates).addTo(map);
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
  anchor: Anchor;
  size: number;
};

export function createSourceSymbolLayer(
  map: Map,
  sourceName: string,
  id: string,
  { size, icon, anchor }: SymbolOptions
) {
  map.addLayer({
    id,
    type: "symbol",
    source: sourceName,
    layout: {
      "icon-image": icon,
      "icon-size": size,
      "icon-anchor": anchor,
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
    { padding: 30 }
  );
}
