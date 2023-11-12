import React from "react";
import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import prisma from "../../db";

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: string[];
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
    },
  });

  if (!restaurant) throw new Error();
  return restaurant;
};
const RestaurantDetailsPage = async (props: any) => {
  console.log("🚀 ~ file: page.tsx:34 ~ RestaurantDetailsPage ~ props:", props);
  //by default, eveery page has props sent by default which contains both the params and searchParams
  const restaurant = await fetchRestaurantBySlug(props.params.slug);
  console.log(
    "🚀 ~ file: page.tsx:17 ~ RestaurantDetailsPage ~ restaurant:",
    restaurant
  );

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating />
        <Description description={restaurant.description} />
        <Images />
        <Reviews />
      </div>
      <ReservationCard />
    </>
  );
};

export default RestaurantDetailsPage;
