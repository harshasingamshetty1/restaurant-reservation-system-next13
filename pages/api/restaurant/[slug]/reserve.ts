import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailabileTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({
        errorMessage: "Restaurant not found",
      });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res.status(400).json({
        errorMessage: "Restaurant is not open at that time",
      });
    }

    const searchTimesWithTables = await findAvailabileTables({
      day,
      time,
      res,
      restaurant,
    });

    if (!searchTimesWithTables) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }
    /* 
      here, we have to check all this logic again, bcoz
      when there is huge traffic, there might be bookings happened ,
       even after clicking user has searched for a time and still waited for a while to reserve the table.
    */
    const searchTimeWithTables = searchTimesWithTables.find((t) => {
      return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if (!searchTimeWithTables) {
      return res.status(400).json({
        errorMessage: "No availablity, cannot book",
      });
    }

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          /* 
            firsting pushing the table Id of the 4 size table, which is the first one in the array.
            then remove the 1st element we just pushed into tablesToBook.
            then decrease the seatsRemaining 
          */
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          /* 
            this case is for, when the party size is <= 2,
            but we dont have any 2 size table available.
            so, we have to use 4 size table for the party size.
          */
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((table_id) => {
      return {
        table_id,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json(booking);
  }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=15:00:00.000Z&partySize=8
