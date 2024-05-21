"use client";
import React, { useState } from "react";
import { partySize as partySizes, times } from "../../../../data";
import ReactDatePicker from "react-datepicker";
import useAvailabilities from "../../../../hooks/useAvailabilities";
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
  const handleDateChange = (date: Date | null) => {
    if (date) {
      return setSelectedDate(date);
    } else return setSelectedDate(null);
  };
  const handleClick = () => {
    fetchAvailabilities({
      slug,
      partySize: 1,
      day: "",
      time: "",
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
              return <option value="">{size.label}</option>;
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
          >
            Find a Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
