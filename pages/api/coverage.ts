import type { NextApiRequest, NextApiResponse } from "next";

const token = process.env.API_MAPBOX_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lng, lat, time } = req.query;

  if (req.method !== "GET" || !lng || !lat || !time) {
    return res.status(405).end();
  }

  const resp = await fetch(
    `https://api.mapbox.com/isochrone/v1/mapbox/driving/${lng},${lat}?contours_minutes=${time}&polygons=true&denoise=1&generalize=500&access_token=${token}`
  );
  const data = await resp.json();

  res.status(200).json(data);
}
