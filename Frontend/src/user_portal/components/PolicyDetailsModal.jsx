import React, { useState } from "react";
import { Modal, Link, InputLabel, TextField } from "@mui/material";
import { formatDate } from "../../utils/helperSnippets";

const PolicyDetailsModal = ({ open, onClose, selectedRow }) => {
  const [showImages, setShowImages] = useState(false);

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
  const renderFilePreview = (file) => {
    const url = file.file;
    const fileType = getFileType(url);

    if (fileType === "image") {
      return (
        <img
          src={url}
          alt="File Preview"
          className="max-w-[200px] max-h-[200px] mb-2"
        />
      );
    } else if (fileType === "pdf") {
      return (
        <iframe
          src={url}
          type="application/pdf"
          className="w-full h-[200px]"
        ></iframe>
      );
    } else {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      );
    }
  };

  const getFileType = (url) => {
    if (
      url.includes(".png") ||
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".gif")
    ) {
      return "image";
    } else if (url.includes(".pdf")) {
      return "pdf";
    } else {
      return "other";
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="detail-modal-title"
      aria-describedby="detail-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="md:w-[50%] w-[90%] gap-4 bg-white flex flex-col rounded-md shadow-lg overflow-y-auto max-h-[80vh] items-center py-[30px] px-[60px]">
        <div className="w-full flex mt-[10px] flex-col justify-start items-start">
          <button
            disabled
            className="text-white justify-center bg-[#003049] outline-none md:text-[24px] font-semibold rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md transition duration-300 ease-in-out hover:bg-[#00213A]"
            type="button"
          >
            Policy Type: ({selectedRow?.policyType})
          </button>
          <h1 className="font-bold mt-[20px] lg:text-[25px]">
            Form for {selectedRow?.policyType} Quote
          </h1>
        </div>

        {/* Common fields for all policy types */}
        {selectedRow?.persons &&
          selectedRow?.persons.map((person, index) => (
            <React.Fragment key={index}>
              <div className="w-full flex flex-col justify-center items-start">
                <p className="font-bold text-[17px]">Person {index + 1}</p>
              </div>
              <div className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
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
            </React.Fragment>
          ))}

        {selectedRow?.mailingAddress &&
          renderTextField("Mailing Address", selectedRow.mailingAddress)}

        {selectedRow?.occupancy &&
          renderTextField("Occuapancy", selectedRow.occupancy)}

        {/* Auto-specific fields */}
        {selectedRow?.policyType === "Auto" && (
          <>
            {selectedRow.garaging_address &&
              renderTextField("Garaging Address", selectedRow.garaging_address)}
            {selectedRow.vehicles &&
              selectedRow.vehicles.map((vehicle, index) => (
                <React.Fragment key={index}>
                  <div className="w-full flex flex-col justify-center items-start">
                    <p className="font-bold text-[17px]">Vehicle {index + 1}</p>
                  </div>
                  <div className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 flex-wrap gap-5 justify-center items-center">
                    {vehicle.vin === "no" && (
                      <>
                        {renderTextField(`Make ${index + 1}`, vehicle.v_make)}
                        {renderTextField(`Model ${index + 1}`, vehicle.v_model)}
                        {renderTextField(`Year ${index + 1}`, vehicle.v_year)}
                        {vehicle.current_insurance === "yes" &&
                          renderTextField(
                            `Expiration Date ${index + 1}`,
                            vehicle.expiration_date
                          )}
                      </>
                    )}
                    {vehicle.vin === "no" &&
                      renderTextField(
                        `Garaging Address ${index + 1}`,
                        vehicle.v_garaging_address_input
                      )}
                    {vehicle.vin === "yes" && (
                      <>
                        {renderTextField(
                          `VIN Number ${index + 1}`,
                          vehicle.vin_number
                        )}
                        {renderTextField(
                          `Garaging Address ${index + 1}`,
                          selectedRow.garaging_address
                        )}
                      </>
                    )}
                  </div>
                </React.Fragment>
              ))}
            {selectedRow.UM &&
              renderTextField("Uninsured Motorists/ UM", selectedRow.UM)}
            {selectedRow.property_damage &&
              renderTextField("Property Damage", selectedRow.property_damage)}
            {selectedRow.bodily_injury_limit &&
              renderTextField(
                "Bodily Injury Limit",
                selectedRow.bodily_injury_limit
              )}
            {selectedRow.collision_deductible &&
              renderTextField(
                "Collision Deductible",
                selectedRow.collision_deductible
              )}
            {selectedRow.comprehensive_deductible &&
              renderTextField(
                "Comprehensive Deductible",
                selectedRow.comprehensive_deductible
              )}
          </>
        )}

        {/* Flood-specific fields */}
        {selectedRow?.policyType === "Flood" && (
          <>
            {selectedRow.address &&
              renderTextField("Address to be insured", selectedRow.address)}
            <div className="w-full grid grid-cols-1 mt-[20px] flex-wrap mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              {selectedRow.cert_elevation &&
                renderTextField(
                  "Do you have an elevation certificate?",
                  selectedRow.cert_elevation
                )}
              {selectedRow.newPurchase &&
                renderTextField("New Purchase?", selectedRow.newPurchase)}
              {selectedRow.newPurchase === "yes" &&
                renderDateField("Closing Date", selectedRow.closingDate)}
              {selectedRow.haveCurrentPolicy === "yes" &&
                renderDateField("Expiry Date", selectedRow.expiryDate)}
              {selectedRow.haveCurrentPolicy &&
                renderTextField(
                  "Have Current Policy?",
                  selectedRow.haveCurrentPolicy
                )}
            </div>
          </>
        )}

        {/* Home-specific fields */}
        {selectedRow?.policyType === "Home" && (
          <>
            {selectedRow.address &&
              renderTextField("Address to be insured", selectedRow.address)}
            <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              {selectedRow.ishomebuild &&
                renderTextField(
                  "Is this home built before 2005?",
                  selectedRow.ishomebuild
                )}
              {selectedRow.newPurchase &&
                renderTextField("New Purchase?", selectedRow.newPurchase)}
            </div>
            <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              {selectedRow.closingDate &&
                renderDateField("Closing Date", selectedRow.closingDate)}
              {selectedRow.expiryDate &&
                renderDateField("Expiry Date", selectedRow.expiryDate)}
            </div>
          </>
        )}

        {/* Liability-specific fields */}
        {selectedRow?.policyType === "Liability" && (
          <>
            <div className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              {selectedRow.application_policy &&
                renderTextField("Policy Type", selectedRow.application_policy)}
              {selectedRow.coverageAmount &&
                renderTextField("Coverage Amount", selectedRow.coverageAmount)}
            </div>
            {selectedRow.application_policy === "liability" && (
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <h2 className="font-bold mt-[20px] lg:text-[25px]">
                  Addresses
                </h2>
                <p>Number of Addresses: {selectedRow.addresses.length}</p>
                {selectedRow.addresses.map((address, index) => (
                  <div key={index} className="w-full">
                    {renderTextField(`Address ${index + 1}`, address.address)}
                  </div>
                ))}
              </div>
            )}
            {selectedRow.application_policy === "umbrella" && (
              <>
                <div className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 flex-wrap gap-5 justify-center items-center">
                  {renderTextField(
                    `Number of address`,
                    selectedRow.address_num
                  )}
                  {renderTextField(
                    `Owner occupied address`,
                    selectedRow.owner_occupied_num
                  )}
                  {renderTextField(
                    `Rented address`,
                    selectedRow.rented_address_num
                  )}
                </div>
                <div className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 flex-wrap gap-5 justify-center items-center">
                  {renderTextField(`Cars`, selectedRow.autos.cars)}
                  {renderTextField(
                    `Motorcycles`,
                    selectedRow.autos.motorcycles
                  )}
                  {renderTextField(`Golf Carts`, selectedRow.autos.golf_carts)}
                  {renderTextField(`Boats`, selectedRow.autos.boats)}
                </div>
              </>
            )}
          </>
        )}

        {/* File upload section */}
        {selectedRow?.files && selectedRow.files.length > 0 && (
          <div className="w-full mb-4">
            <button
              className="text-white justify-center bg-[#17A600] outline-none md:text-[20px] font-light rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md"
              type="button"
              onClick={() => setShowImages(!showImages)}
            >
              {showImages
                ? "Hide Uploaded Inspections"
                : "View Uploaded Inspections"}
            </button>
            <div className="w-full grid grid-cols-2 flex-wrap justify-center items-center">
              {showImages &&
                selectedRow.files.map((file, index) => (
                  <ul key={index} className="w-full">
                    <li className="mt-2" key={file.name}>
                      {renderFilePreview(file)}
                    </li>
                    <a
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <button className="bg-blue-500 rounded-lg text-white font-semibold px-2 py-2 mt-[10px] mb-[10px]">
                        Download File
                      </button>
                    </a>
                  </ul>
                ))}
            </div>
          </div>
        )}

        {/* Action button */}
        {/* {selectedRow?.status.toLowerCase() === "completed" && (
          <div className="w-full flex mt-[10px] flex-col justify-center items-center">
            <Link
              to={`/admin_portal/editor?qsr_type=${selectedRow.policyType}&q_id=${selectedRow.id}&qu_id=${selectedRow.user.id}`}
              target="_blank"
              onClick={onClose}
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
        )} */}
      </div>
    </Modal>
  );
};

export default PolicyDetailsModal;
