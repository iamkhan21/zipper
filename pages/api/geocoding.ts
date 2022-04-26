import type { NextApiRequest, NextApiResponse } from "next";

const token = process.env.API_MAPBOX_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.body?.address;

  if (req.method !== "POST" || !address) {
    return res.status(405).end();
  }

  const encodedAddress = encodeURIComponent(address);
  const resp = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?limit=1&types=address&access_token=${token}`
  );
  const data = await resp.json();

  res.status(200).json(data);
}
