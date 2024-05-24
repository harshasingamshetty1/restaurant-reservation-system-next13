import React from "react";
import Header from "./components/Header";
import Form from "./components/Form";
import prisma from "../../db";
import { Restaurant } from "@prisma/client";
import { notFound } from "next/navigation";
import { log } from "console";

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  });
  if (!restaurant) {
    notFound();
  }
  return restaurant;
};
const ReservationPage = async ({
  params,
  searchParams,
}: {
  params: {
    slug: string;
  };
  searchParams: {
    date: string;
    partySize: string;
  };
}) => {
  console.log("params", params);
  const [day, time] = searchParams.date.split("T");
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          name={restaurant.name}
          image={restaurant.main_image}
          day={day}
          time={time}
          partySize={searchParams.partySize}
        />
        <Form
          slug={params.slug}
          day={day}
          time={time}
          partySize={searchParams.partySize}
        />
      </div>
    </div>
  );
};

export default ReservationPage;
