import Link from "next/link";
import React from "react";
import { PRICE } from "@prisma/client";
import Price from "./Price";
import prisma from "../db";

interface RestaurantCardProps {
  name: string;
  slug: string;
  price: PRICE;
  mainImage: string;
  cuisineId: number;
  locationId: number;
}
const RestaurantCard = async ({
  name,
  slug,
  price,
  mainImage,
  cuisineId,
  locationId,
}: RestaurantCardProps) => {
  const cuisine = await prisma.cuisine.findUnique({
    where: { id: cuisineId },
  });
  const cuisineName = cuisine?.name;

  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });
  const locationName = location?.name;

  return (
    <Link href={`../restaurant/${slug}`}>
      <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
        <img src={mainImage} alt="mainImage" className="w-full h-36" />
        <div className="p-1 text-black">
          <h3 className="font-bold text-2xl mb-2">{name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">*****</div>
            <p className="ml-2">77 reviews</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{cuisineName}</p>
            <Price price={price} />
            <p>{locationName}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
