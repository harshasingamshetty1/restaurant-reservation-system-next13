import React from "react";
import NavBar from "../../components/NavBar";
import Header from "./components/Header";
import Form from "./components/Form";

const ReservationPage = () => {
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header />
        <Form />
      </div>
    </div>
  );
};

export default ReservationPage;
