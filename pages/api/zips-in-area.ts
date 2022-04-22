import type { NextApiRequest, NextApiResponse } from "next";
import pointsWithinPolygon from "@turf/points-within-polygon";
import { FeatureCollection, Point, Polygon } from "@turf/helpers";
import centers from "@data/usa_zip_centers.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const area = req.body;

  if (req.method !== "POST" || !area) {
    return res.status(405).end();
  }

  const zips = pointsWithinPolygon(
    centers as FeatureCollection<Point>,
    area as FeatureCollection<Polygon>
  );

  res.status(200).json(zips);
}
