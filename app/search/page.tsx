import React from "react";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantCard from "./components/RestaurantCard";
import prisma from "../db";
import { Cuisine, PRICE, Location, Review } from "@prisma/client";
interface SearchParams {
  location?: string;
  cuisine?: string;
  price?: PRICE;
}
interface RestaurantCardType {
  name: string;
  price: PRICE;
  location: Location;
  cuisine: Cuisine;
  slug: string;
  main_image: string;
  reviews: Review[];
}
const fetchRestaurantsByParams = async (
  searchParams: SearchParams
): Promise<RestaurantCardType[]> => {
  const where: any = {};

  if (searchParams.location) {
    const location = {
      name: {
        equals: searchParams.location.toLowerCase(),
      },
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};
const fetchAllLocationsAndCuisines = async () => {
  const locations = await prisma.location.findMany();
  const cuisines = await prisma.cuisine.findMany();
  return { locations, cuisines };
};
const SearchPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const location = searchParams.location;
  const restaurants = await fetchRestaurantsByParams(searchParams);
  const { locations, cuisines } = await fetchAllLocationsAndCuisines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => {
              return (
                <RestaurantCard restaurant={restaurant} key={restaurant.slug} />
              );
            })
          ) : (
            <div className="text-2xl ">
              Sorry, no restaurants found for this search{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
