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
  // fetch all tables at restaurs
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });
  if (!restaurant)
    return res.status(400).json({ error: "Invalid data provided" });

  const tables = restaurant.tables;
  const searchTimeWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  /* 
    here we are filtering the tables, based on whether there is a booking at that time or not.
    If there is a booking for that table at that time, remove it from the list.
*/
  searchTimeWithTables.forEach((searchTimeWithTable) => {
    if (searchTimeWithTable.date.toISOString() in currentBookingsObj) {
      searchTimeWithTable.tables = searchTimeWithTable.tables.filter((t) => {
        return !(
          t.id in currentBookingsObj[searchTimeWithTable.date.toISOString()]
        );
      });
    }
  });
  /* 
    finally lets return the possible searchTimes and whether the restraunt can accommodate the,
    partySize or not.
    and also, check whether the restraunt is open or not, for those search times
  */

  const availabilities = searchTimeWithTables
    .map((st) => {
      const availableSize = st.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);
      return {
        time: st.time,
        available: parseInt(partySize) <= availableSize,
      };
    })
    .filter((availability) => {
      const time = new Date(`${day}T${availability.time}`);
      const openTime = new Date(`${day}T${restaurant.open_time}`);
      const closeTime = new Date(`${day}T${restaurant.close_time}`);
      return time >= openTime && time <= closeTime;
    });
  return res.json({
    currentBookingsObj,
    // tables: restaurant.tables,
    // searchTimeWithTables,
    availabilities,
  });
}
//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?time=16:30:00.000Z&day=2023-12-24&partySize=8
