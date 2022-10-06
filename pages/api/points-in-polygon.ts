import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";
import { covertGeometryToString } from "@utils/converters";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const area = req.body;

  if (req.method !== "POST" || !area) {
    return res.status(405).end();
  }

  const { data, error } = await supabase.rpc("find_zips_in_polygon", {
    poly: covertGeometryToString(area),
  });

  if (error) {
    return res.status(500).end(error.message);
  }

  res.status(200).json({ data });
}
