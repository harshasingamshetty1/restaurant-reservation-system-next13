import React from "react";
import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import prisma from "../../db";
import { Review } from "@prisma/client";
import { notFound } from "next/navigation";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: string[];
  reviews: Review[];
  open_time: string;
  close_time: string;
}
const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      description: true,
      images: true,
      name: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) notFound();
  return restaurant;
};
const RestaurantDetailsPage = async (props: any) => {
  //by default, eveery page has props sent by default which contains both the params and searchParams
  const restaurant = await fetchRestaurantBySlug(props.params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <ReservationCard
        openTime={restaurant.open_time}
        closeTime={restaurant.close_time}
      />
    </>
  );
};

export default RestaurantDetailsPage;
