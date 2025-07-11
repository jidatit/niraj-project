import React, { useState } from "react";
import Button from "../components/dropdown_buttons/Button";
import homeicon from "../../assets/dash/home.png";
import caricon from "../../assets/dash/car.png";
import liaicon from "../../assets/dash/lia.png";
import floodicon from "../../assets/dash/flood.png";
import HomeForm from "./RequestFormTypes/HomeForm";
import AutoForm from "./RequestFormTypes/AutoForm";
import LiabilityForm from "./RequestFormTypes/LiabilityForm";
import FloodForm from "./RequestFormTypes/FloodForm";

const RequestPage = ({ selectedUser, PreRenwalQuote }) => {
  const [selectedValue, setSelectedValue] = useState({
    label: "Home Policy",
    value: "Home",
    img: homeicon,
  });

  const options = [
    { label: "Home Policy", value: "Home", img: homeicon },
    { label: "Auto Policy", value: "Auto", img: caricon },
    { label: "Liability Policy", value: "Liability", img: liaicon },
    { label: "Flood Policy", value: "Flood", img: floodicon },
  ];

  const handleSelect = (item) => {
    setSelectedValue(item);
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <div className="w-full md:w-[90%] px-2 md:px-20 bg-white shadow-md pt-10 pb-10 flex flex-col gap-10 justify-center items-center">
          <div className="w-full flex flex-col justify-center items-start">
            <Button items={options} onSelect={handleSelect} />
          </div>

          {selectedValue && selectedValue.value === "Home" && (
            <HomeForm
              selectedUser={selectedUser}
              PreRenwalQuote={PreRenwalQuote}
            />
          )}
          {selectedValue && selectedValue.value === "Auto" && (
            <AutoForm
              selectedUser={selectedUser}
              PreRenwalQuote={PreRenwalQuote}
            />
          )}
          {selectedValue && selectedValue.value === "Liability" && (
            <LiabilityForm
              selectedUser={selectedUser}
              PreRenwalQuote={PreRenwalQuote}
            />
          )}
          {selectedValue && selectedValue.value === "Flood" && (
            <FloodForm
              selectedUser={selectedUser}
              PreRenwalQuote={PreRenwalQuote}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RequestPage;
