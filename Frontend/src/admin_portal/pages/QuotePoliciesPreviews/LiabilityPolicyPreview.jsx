import React from "react";
import Modal from "@mui/material/Modal";
import { TextField, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helperSnippets";

const LiabilityPolicyPreview = ({ data, open, handleClose }) => {
  const {
    application_policy,
    autos,
    owner_occupied_num,
    rented_address_num,
    address_num,
    coverageAmount,
    addresses,
    persons,
    mailingAddress,
  } = data;
  console.log("data", data);
  const renderTextField = (label, value) => (
    <div className="flex w-full flex-col justify-center items-start gap-2">
      <InputLabel htmlFor="name">{label}</InputLabel>
      <TextField
        className="w-full"
        id="name"
        label={label}
        variant="outlined"
        value={value}
        disabled
      />
    </div>
  );

  const renderDateField = (label, value) => (
    <div className="flex w-full flex-col justify-center items-start gap-2">
      <InputLabel htmlFor="exp">
        {label} <span className="text-xs">(DD-MM-YYYY)</span>
      </InputLabel>
      <TextField
        className="w-full"
        id="exp"
        label={label}
        variant="outlined"
        value={formatDate(value)}
        disabled
      />
    </div>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="md:w-[50%] w-[90%] gap-4 bg-white flex flex-col rounded-md shadow-lg overflow-y-auto max-h-[80vh] items-center py-[30px] px-[60px]">
          {/* Header Section */}
          <div className="w-full flex mt-[10px] flex-col justify-start items-start">
            <button
              disabled
              className="text-white justify-center bg-[#003049] outline-none md:text-[24px] font-semibold rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md transition duration-300 ease-in-out hover:bg-[#00213A]"
              type="button"
            >
              Policy Type: (Liability)
            </button>
            <h1 className="font-bold mt-[20px] lg:text-[25px]">
              Form for Liability Quote
            </h1>
          </div>

          {/* Quote Request Section */}
          <div className="w-full mt-[30px] p-[20px] bg-[#F1F4F8] rounded-lg shadow-md">
            <h2 className="font-semibold text-[20px] text-[#003049] mb-[10px]">
              {data.user.signupType === "Referral"
                ? "Quote Requested by Referral"
                : "Quote Requested by Client"}
            </h2>
            <p className="text-[16px] mb-[5px]">
              <strong>Name:</strong> {data.user.name}
            </p>
            <p className="text-[16px]">
              <strong>Email:</strong> {data.user.email}
            </p>
          </div>

          {/* Person Details */}
          {persons &&
            persons.map((person, index) => (
              <div key={index} className="w-full mt-[20px]">
                <p className="font-bold text-[17px]">Person {index + 1}</p>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[10px]">
                  {person.name &&
                    renderTextField(
                      `Name to be Insured ${index + 1}`,
                      person.name
                    )}
                  {person.dob &&
                    renderDateField(`Date of Birth ${index + 1}`, person.dob)}
                  {person.email &&
                    renderTextField(`Email ${index + 1}`, person.email)}
                  {person.phoneNumber &&
                    renderTextField(
                      `Phone Number ${index + 1}`,
                      person.phoneNumber
                    )}
                  {person.zipCode &&
                    renderTextField(`Zip Code ${index + 1}`, person.zipCode)}
                </div>
              </div>
            ))}

          {/* Mailing Address */}
          {mailingAddress && renderTextField("Mailing Address", mailingAddress)}

          {/* Policy Details */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[20px]">
            {application_policy &&
              renderTextField("Policy Type", application_policy)}
            {coverageAmount &&
              renderTextField("Coverage Amount", coverageAmount)}
          </div>

          {/* Conditional Policy Sections */}
          {application_policy === "liability" && (
            <div className="w-full mt-[20px]">
              <h2 className="font-bold lg:text-[25px]">Addresses</h2>
              <p>Number of Addresses: {addresses.length}</p>
              {addresses.map((address, index) => (
                <div key={index} className="w-full mt-[10px]">
                  {renderTextField(`Address ${index + 1}`, address.address)}
                </div>
              ))}
            </div>
          )}

          {application_policy === "umbrella" && (
            <>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[20px]">
                {renderTextField(`Number of address`, address_num)}
                {renderTextField(`Owner occupied address`, owner_occupied_num)}
                {renderTextField(`Rented address`, rented_address_num)}
              </div>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[20px]">
                {renderTextField(`Cars`, autos.cars)}
                {renderTextField(`Motorcycles`, autos.motorcycles)}
                {renderTextField(`Golf Carts`, autos.golf_carts)}
                {renderTextField(`Boats`, autos.boats)}
              </div>
            </>
          )}

          {/* Footer Section */}
          <div className="w-full flex mt-[20px] justify-center">
            <Link
              onClick={handleClose}
              className="w-full"
              to={`/admin_portal/editor?qsr_type=${data.policyType}&q_id=${data.id}&qu_id=${data.user.id}`}
              target="_blank"
            >
              <button
                className="text-white w-full justify-center bg-[#F77F00] outline-none md:text-[15px] font-semibold rounded-lg text-[12px] px-5 py-4 text-center inline-flex items-center shadow-md"
                type="button"
              >
                Send the Customer a Customized Quote According to their
                Requirements
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LiabilityPolicyPreview;
