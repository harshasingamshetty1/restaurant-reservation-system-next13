import React from "react";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantCard from "./components/RestaurantCard";
import prisma from "../db";
import { Cuisine, PRICE, Location } from "@prisma/client";
interface RestaurantCardType {
  name: string;
  price: PRICE;
  location: Location;
  cuisine: Cuisine;
  slug: string;
  main_image: string;
}
const fetchRestaurantsByLocation = async (
  location: string
): Promise<RestaurantCardType[]> => {
  // if (!location) return prisma.restaurant.findMany({});
  return await prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: location.toLowerCase(),
        },
      },
    },
    select: {
      name: true,
      price: true,
      location: true,
      cuisine: true,
      slug: true,
      main_image: true,
    },
  });
};
const SearchPage = async ({
  searchParams,
}: {
  searchParams: { location: string };
}) => {
  const location = searchParams.location;
  const restaurants = await fetchRestaurantsByLocation(location);
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar />
        <div className="w-5/6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => {
              return <RestaurantCard restaurant={restaurant} />;
            })
          ) : (
            <div className="text-2xl ">
              Sorry, no restaurants found in this area{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
