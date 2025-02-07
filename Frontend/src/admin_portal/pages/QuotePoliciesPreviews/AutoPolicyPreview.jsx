import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { TextField, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helperSnippets";
import { handleDownload } from "../../../utils/handleDownload";

const AutoPolicyPreview = ({ data, open, handleClose }) => {
  const [showImages, setShowImages] = useState(false);
  const {
    drivers,
    files,
    bodily_injury_limit,
    collision_deductible,
    comprehensive_deductible,
    garaging_address,
    property_damage,
    vehicles,
    UM,
    mailingAddress,
    occupancy,
  } = data;

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
          <div className="w-full flex mt-[10px] flex-col justify-start items-start">
            <button
              disabled
              className="text-white justify-center bg-[#003049] outline-none md:text-[24px] font-semibold rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md transition duration-300 ease-in-out hover:bg-[#00213A]"
              type="button"
            >
              Policy Type: ( Auto )
            </button>
            <h1 className="font-bold mt-[20px] lg:text-[25px]">
              Form for Auto Quote
            </h1>
          </div>

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
          {drivers &&
            drivers.map((driver, index) => (
              <>
                <div
                  key={index + 1}
                  className="w-full flex flex-col justify-center items-start"
                >
                  <p className="font-bold text-[17px]">Driver {index + 1}</p>
                </div>
                <div
                  key={index}
                  className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 flex-wrap gap-5 justify-center items-center"
                >
                  {driver.name &&
                    renderTextField(
                      `Name to be Insured  ${index + 1}`,
                      driver.name
                    )}
                  {driver.dob &&
                    renderDateField(`Date of Birth ${index + 1}`, driver.dob)}
                  {driver.LN &&
                    renderTextField(`License Number ${index + 1}`, driver.LN)}
                  {driver.email &&
                    renderTextField(`Email ${index + 1}`, driver.email)}
                  {driver.phoneNumber &&
                    renderTextField(
                      `Phone Number ${index + 1}`,
                      driver.phoneNumber
                    )}
                  {driver.zipCode &&
                    renderTextField(`Zip Code ${index + 1}`, driver.zipCode)}
                </div>
              </>
            ))}

          {mailingAddress && renderTextField("Mailing Address", mailingAddress)}
          {occupancy && renderTextField("Occuapancy", occupancy)}
          {garaging_address &&
            renderTextField("Garaging Address", garaging_address)}

          {vehicles &&
            vehicles.map((vehicle, index) => (
              <>
                <div
                  key={index + 1}
                  className="w-full flex flex-col justify-center items-start"
                >
                  <p className="font-bold text-[17px]">Vehicle {index + 1}</p>
                </div>
                <div
                  key={index}
                  className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 flex-wrap gap-5 justify-center items-center"
                >
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
                        garaging_address
                      )}
                    </>
                  )}
                </div>
                <div className="w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 flex-wrap gap-5 justify-center items-center">
                  {renderDateField("Expiration Date", vehicle.expiration_date)}
                </div>
              </>
            ))}

          {UM && renderTextField("Uninsured Motorists/ UM", UM)}
          {property_damage &&
            renderTextField("Property Damage", property_damage)}
          {bodily_injury_limit &&
            renderTextField("Bodily Injury Limit", bodily_injury_limit)}
          {collision_deductible &&
            renderTextField("Collision Deductible", collision_deductible)}
          {comprehensive_deductible &&
            renderTextField(
              "Comprehensive Deductible",
              comprehensive_deductible
            )}

          {files && files.length > 0 && (
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
                {showImages === true &&
                  files.map((file, index) => (
                    <ul key={index} className="w-full">
                      <a
                        href={file.file}
                        target="_blank"
                        download={file.name}
                        rel="noreferrer"
                      >
                        <li className="mt-2" key={file.name}>
                          {renderFilePreview(file)}
                        </li>
                      </a>
                      {/* <a href={file.file} download={file.name}> */}
                      <button
                        type="button"
                        onClick={() => handleDownload(file)}
                        className="bg-blue-500 rounded-lg text-white font-semibold px-2 py-2 mt-[10px] mb-[10px]"
                      >
                        Download File
                      </button>
                      {/* </a> */}
                    </ul>
                  ))}
              </div>
            </div>
          )}

          {data.status.toLowerCase() === "completed" && (
            <div className="w-full flex mt-[10px] flex-col justify-center items-center">
              <Link
                onClick={handleClose}
                className="w-full"
                to={`/admin_portal/editor?qsr_type=${data.policyType}&q_id=${data.id}&qu_id=${data.user.id}`}
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
          )}
        </div>
      </Modal>
    </>
  );
};

export default AutoPolicyPreview;
