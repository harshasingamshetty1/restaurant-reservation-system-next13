import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import prisma from "./db";

const fetchRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany();
  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => {
          const props = {
            name: restaurant.name,
            price: restaurant.price,
            mainImage: restaurant.main_image,
            cuisineId: restaurant.cuisine_id,
            locationId: restaurant.location_id,
            slug: restaurant.slug,
          };
          // { cuisineName, locationName } =  getCuisineAndLocation(restaurant)
          return <RestaurantCard {...props} />;
        })}
      </div>
    </main>
  );
}
