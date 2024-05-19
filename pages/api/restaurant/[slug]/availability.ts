import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import prisma from "../../../../app/db";
import { tr } from "date-fns/locale";

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

  const { id: desiredRestaurantId } = await prisma.restaurant.findFirstOrThrow({
    where: { slug },
    select: {
      id: true,
    },
  });
  const currentBookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
      restaurant_id: desiredRestaurantId,
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const currentBookingsObj: { [key: string]: { [key: string]: true } } = {};

  currentBookings.forEach((booking) => {
    currentBookingsObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((previousValue, currentValue) => {
        return { ...previousValue, [currentValue.table_id]: true };
      }, {});
  });

  return res.json(currentBookingsObj);
}
//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisi-ottawa/availability?time=16:30:00.000Z&day=2023-12-24&partySize=3
