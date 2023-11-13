import { Item } from "@prisma/client";
import React from "react";

const Menu = ({ items }: { items: Item[] }) => {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {items.length > 0 ? (
            items.map((item) => {
              return (
                <div className=" border rounded p-3 w-[49%] mb-3" key={item.id}>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="font-light mt-1 text-sm">{item.description}</p>
                  <p className="mt-7">{item.price}</p>
                </div>
              );
            })
          ) : (
            <div className="text-2xl">
              This restaurant did not provide the menu.
            </div>
          )}
          {/* MENU CARD */}
        </div>
      </div>
    </main>
  );
};

export default Menu;
