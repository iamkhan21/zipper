import type { NextApiRequest, NextApiResponse } from "next";
import { getZipBoundaries } from "@lib/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const zips = req.body?.zips;

  if (req.method !== "POST" || !zips?.length) {
    return res.status(405).end();
  }

  const result = await Promise.allSettled(zips.map(getZipBoundaries));

  const boundaries = result.map((data) =>
    data.status === "fulfilled" ? data.value : {}
  );

  res.status(200).json(boundaries);
}
