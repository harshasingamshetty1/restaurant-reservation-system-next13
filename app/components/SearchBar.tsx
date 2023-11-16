"use client";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
      <input
        className="rounded  mr-3 p-2 w-[450px] bg-white"
        type="text"
        placeholder="State, city or town"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="rounded bg-red-600 px-9 py-2 text-white"
        onClick={(e) => {
          if (location === "") return;
          else router.push(`/search?location=${location}`);
          setLocation("");
        }}
      >
        Let's go
      </button>
    </div>
  );
}

export default SearchBar;
