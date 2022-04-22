import type { NextApiRequest, NextApiResponse } from "next";
import { Feature, Geometry } from "geojson";
import boundaries from "@data/usa_zip_boundaries.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const zips = req.body?.zips;

  if (req.method !== "POST" || !zips?.length) {
    return res.status(405).end();
  }

  const result = zips.map(
    //@ts-ignore
    (zip: string) => (boundaries as Record<string, Feature<Geometry>>)[zip]
  );

  res.status(200).json(result);
}
