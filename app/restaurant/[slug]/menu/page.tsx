import React from "react";
import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";
import prisma from "../../../db";

const MenuPage = async ({ params }: { params: { slug: string } }) => {
  //with this approach, there will be 2 db calls, hence slower
  // const restaurant = await prisma.restaurant.findUnique({
  //   where: { slug: params.slug },
  //   select: {
  //     id: true,
  //   },
  // });
  // const restId = restaurant?.id;
  // const items = await prisma.item.findMany({
  //   where: { restaurant_id: restId },
  // });

  //we could also use the eager-loading mechanism with the "include" keyword, to make it more efficient.

  // here, from restaurant table, we will be able to acccess all the related tables without having to do multiple query calls, prisma handles the joining of tables for us.
  //and hence, we were able to directly use the items feild in the select query.
  const restaurantItems = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    select: {
      items: true,
    },
  });
  if (!restaurantItems) {
    throw new Error("No items");
  }
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        <Menu items={restaurantItems?.items} />
      </div>
    </>
  );
};

export default MenuPage;
