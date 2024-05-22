"use client";
import React, { useState } from "react";
import { partySize as partySizes, times } from "../../../../data";
import ReactDatePicker from "react-datepicker";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import {
  convertToDisplayTime,
  Time,
} from "../../../../utils/convertToDisplayTime";
const ReservationCard = ({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) => {
  const { data, error, loading, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState(openTime);
  const [partySize, setPartySize] = useState("1");
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split("T")[0]
  );
  console.log("🚀 ~ partySize:", partySize);
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    } else return setSelectedDate(null);
  };
  const handleClick = () => {
    fetchAvailabilities({
      slug,
      partySize: partySize,
      day: selectedDay,
      time: selectedTime,
    });
  };
  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithinWindow = true;
      }
      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }
      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };
  const validTimes = filterTimeByRestaurantOpenWindow();
  return (
    <div className="w-[27%] relative text-reg">
      <div className="fixed w-[15%] bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation{partySize}</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select
            name=""
            className="py-3 border-b font-light bg-white"
            id=""
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
          >
            {partySizes.map((size) => {
              return <option value={size.value}>{size.label}</option>;
            })}
          </select>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[48%] ">
            <label htmlFor="">Date</label>
            {/* have to pass the prop 'selected'  */}
            <ReactDatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat={"dd MMM y"}
              className="py-3 border-b font-light text-reg w-full bg-white"
            />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              name=""
              id=""
              className="py-3 border-b font-light bg-white"
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
              }}
            >
              {validTimes.map((time, index) => {
                return (
                  <option key={index} value={time.time}>
                    {time.displayTime}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? <CircularProgress color="inherit" /> : "Find a time"}
          </button>
        </div>

        {data && data.length ? (
          <div className="mt-4">
            <p className="text-reg">Select a Time</p>
            <div className="flex flex-wrap mt-2">
              {data.map((time) => {
                return time.available ? (
                  <Link
                    href={`/reserve/${slug}?date=${selectedDay}T${time.time}&partySize=${partySize}`}
                    className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                  >
                    <p className="text-sm font-bold">
                      {convertToDisplayTime(time.time as Time)}
                    </p>
                  </Link>
                ) : (
                  <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReservationCard;
