import type { NextApiRequest, NextApiResponse } from "next";

const token = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lng, lat } = req.query;

  if (req.method !== "GET" || !lng || !lat) {
    return res.status(405).end();
  }

  const resp = await fetch(
    `https://api.mapbox.com/isochrone/v1/mapbox/driving/${lng},${lat}?contours_minutes=60&polygons=true&denoise=1&access_token=${token}`
  );
  const data = await resp.json();
  // const data = (await import("@data/coverage.json")).default;

  res.status(200).json(data);
}
