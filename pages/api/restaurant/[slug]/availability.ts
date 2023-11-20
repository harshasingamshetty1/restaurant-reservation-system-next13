import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    day: string;
    time: string;
    partySize: string;
    slug: string;
  };

  if (!day || !time || !partySize) {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  const searchTimes = times.find(
    (currentTime) => currentTime.time === time
  )?.searchTimes;

  if (!searchTimes)
    return res.status(400).json({ error: "Invalid time provided" });
  return res.json({
    slug,
    day,
  });
}
//http://localhost:3000/api/restaurant/pukka-niagara/availability?time=00:30:00.000Z&day=123&partySize=8
