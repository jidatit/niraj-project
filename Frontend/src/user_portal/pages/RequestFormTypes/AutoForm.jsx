import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import plusicon from "../../../assets/dash/plus.png";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { db, storage } from "../../../../db";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tickicon from "../../../assets/dash/tick.png";
import { useAuth } from "../../../AuthContext";
import {
  ClientQuoteReqMail,
  ClientQuoteWithoutInspection,
} from "../../../utils/mailingFuncs";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import { CiCircleRemove } from "react-icons/ci";

const AutoForm = () => {
  const navigate = useNavigate();

  const redirectFunc = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const isClient = currentUser?.data?.signupType === "Client";
  const [buttonstate, setbuttonstate] = useState("Submit");
  const [fileModal, setfileModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchAdminEmail = async () => {
      const db = getFirestore();
      try {
        const adminCollection = collection(db, "admins");
        const adminSnapshot = await getDocs(adminCollection);
        const adminData = adminSnapshot.docs.map((doc) => doc.data());

        // Assuming the admin collection has only one document with the email
        if (adminData.length > 0) {
          setAdminEmail(adminData[0].email); // Adjust this based on your data structure
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchAdminEmail();
  }, []);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setFormData((prevData) => ({
      ...prevData,
      files: acceptedFiles,
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpg, image/svg, image/webp, image/gif",
    multiple: true, // Allow multiple file selection
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Append new files
      setFormData((prevData) => ({
        ...prevData,
        files: acceptedFiles,
      }));
    },
  });

  const removeFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);

      setFormData((prevData) => ({
        ...prevData,
        files: updatedFiles, // Directly update files in FormData
      }));

      return updatedFiles;
    });
  };

  const checkInspections = () => {
    if (formData.files.length === 0) {
      setConfirmDialogOpen(true);
    } else {
      addFormToDb();
    }
  };

  const addFormToDb = async () => {
    try {
      setConfirmDialogOpen(false);
      setbuttonstate("Submitting...");
      if (files.length === 0) {
        let nofilesformData = {
          ...formData,
          status: "pending",
          status_step: "1",
        };
        await addDoc(collection(db, "auto_quotes"), {
          ...nofilesformData, // Include the existing form data
          createdAt: serverTimestamp(), // Automatically add the creation timestamp
          updatedAt: serverTimestamp(), // Set the initial update timestamp to the same as createdAt
        });
        if (currentUser.data.signupType === "Referral") {
          ClientQuoteWithoutInspection(
            formData.drivers.map((driver) => driver.name).join(", "),
            adminEmail,
            "Auto",
            currentUser.data.name,
            currentUser.data.name
          );
        } else {
          ClientQuoteWithoutInspection(
            formData.drivers.map((driver) => driver.name).join(", "),
            adminEmail,
            "Auto",
            "None",
            currentUser.data.name
          );
        }
        // ClientQuoteWithoutInspection(currentUser.data.name, adminEmail, "Auto");
        toast.success("Application submitted with success.");
        setbuttonstate("Submit");
        redirectFunc("/user_portal");
        return;
      }

      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2);

      const promises = files.map(async (file) => {
        const storageRef = ref(
          storage,
          `auto_quotes/${timestamp}_${uniqueId}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const fileUrls = await Promise.all(promises);

      const formDataWithUrls = {
        ...formData,
        files: fileUrls.map((url) => ({ file: url })),
      };

      let statusformData = {
        ...formDataWithUrls,
        status: "completed",
        status_step: "1",
      };
      await addDoc(collection(db, "auto_quotes"), {
        ...statusformData,
        inuser: formDataWithUrls.drivers[0],
        createdAt: serverTimestamp(), // Automatically add the current timestamp
        updatedAt: serverTimestamp(), // Set initial updatedAt to the same timestamp
      });
      if (currentUser.data.signupType === "Referral") {
        ClientQuoteReqMail(
          formData.drivers.map((driver) => driver.name).join(", "), // Concatenate all names
          adminEmail,
          "Auto",
          currentUser.data.name,
          currentUser.data.name
        );
      } else {
        ClientQuoteReqMail(
          formData.drivers.map((driver) => driver.name).join(", "), // Concatenate all names
          adminEmail,
          "Auto",
          "None",
          currentUser.data.name
        );
      }

      setFormData({
        policyType: "Auto",
        mailingAddress: "",
        drivers: [
          {
            name: "",
            dob: "",
            LN: "",
            email: "",
            phoneNumber: "",
            zipCode: "",
          },
        ],
        garaging_address: "",
        mailing: false,
        vehicles: [
          {
            vin: "yes",
            vin_number: "",
            v_make: "",
            v_model: "",
            v_year: "",
            current_insurance: "",
            expiration_date: "",
            v_garaging_address: "",
            v_garaging_address_input: "",
          },
        ],
        bodily_injury_limit: "",
        property_damage: "",
        UM: "",
        comprehensive_deductible: "",
        collision_deductible: "",
        files: [],
        user: { ...currentUser.data, id: currentUser.uid },
        occupancy: "Primary",
      });
      setFiles([]);

      toast.success("Application submitted with success.");
      setbuttonstate("Submit");
      redirectFunc("/user_portal");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application.");
      setbuttonstate("Submit");
    }
  };

  const [formData, setFormData] = useState({
    policyType: "Auto",
    mailingAddress: isClient ? currentUser?.data?.mailingAddress || "" : "",
    drivers: isClient
      ? [
          {
            name: currentUser?.data?.name || "",
            dob: currentUser?.data?.dateOfBirth || "",
            email: currentUser?.data?.email || "",
            phoneNumber: currentUser?.data?.phoneNumber || "",
            zipCode: currentUser?.data?.zipCode || "",
            LN: currentUser?.data?.driversLicense || "",
          },
        ]
      : [
          {
            name: "",
            dob: "",
            email: "",
            phoneNumber: "",
            zipCode: "",
            LN: "",
          },
        ],
    garaging_address: "",
    mailing: false,
    vehicles: [
      {
        vin: "yes",
        vin_number: "",
        v_make: "",
        v_model: "",
        v_year: "",
        current_insurance: "",
        expiration_date: "",
        v_garaging_address: "",
        v_garaging_address_input: "",
      },
    ],
    bodily_injury_limit: "",
    property_damage: "",
    UM: "",
    comprehensive_deductible: "",
    collision_deductible: "",
    files: [],
    user: { ...currentUser.data, id: currentUser.uid },
    occupancy: "Primary",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "mailing") {
      setFormData((prevData) => ({
        ...prevData,
        mailing: checked,
        garaging_address: checked ? currentUser.data.mailingAddress : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddDriver = () => {
    setFormData((prevData) => ({
      ...prevData,
      drivers: [
        ...prevData.drivers,
        { name: "", dob: "", LN: "", email: "", phoneNumber: "", zipCode: "" },
      ],
    }));
  };
  const handleAddVehicle = () => {
    setFormData((prevData) => ({
      ...prevData,
      vehicles: [
        ...prevData.vehicles,
        {
          vin: "yes",
          vin_number: "",
          v_make: "",
          v_model: "",
          v_year: "",
          current_insurance: "",
          expiration_date: "",
          v_garaging_address: "",
          v_garaging_address_input: "",
        },
      ],
    }));
  };

  const handleRemoveDriver = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      drivers: prevData.drivers.filter((_, i) => i !== index),
    }));
  };

  const handleDriverChange = (index, field, value) => {
    const updateddrivers = [...formData.drivers];
    updateddrivers[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      drivers: updateddrivers,
    }));
  };

  const handleVehicleChange = (index, field, value) => {
    const updatedvehicles = [...formData.vehicles];
    updatedvehicles[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      vehicles: updatedvehicles,
    }));
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <ToastContainer />
        <div className="w-full flex flex-col justify-center items-start">
          <h1 className="font-bold lg:text-[25px]">
            Fill out Form for Auto Quote
          </h1>
        </div>

        {formData.drivers.map((driver, index) => (
          <>
            <div
              key={index}
              className="w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-5"
            >
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`name-${index}`}>
                  Name to be Insured
                </InputLabel>
                <TextField
                  className="w-full"
                  id={`name-${index}`}
                  label="Type your name here......"
                  variant="outlined"
                  value={driver.name}
                  onChange={(e) =>
                    handleDriverChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`date-${index}`}>Date of Birth</InputLabel>
                <TextField
                  className="w-full"
                  id={`date-${index}`}
                  type="date"
                  value={driver.dob}
                  onChange={(e) =>
                    handleDriverChange(index, "dob", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`LN-${index}`}>Drivers License</InputLabel>
                <TextField
                  className="w-full"
                  id={`LN-${index}`}
                  type="text"
                  value={driver.LN}
                  onChange={(e) =>
                    handleDriverChange(index, "LN", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`email-${index}`}>Email</InputLabel>
                <TextField
                  className="w-full"
                  id={`email-${index}`}
                  type="email"
                  value={driver.email}
                  onChange={(e) =>
                    handleDriverChange(index, "email", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`phoneNumber-${index}`}>
                  Phone Number
                </InputLabel>
                <TextField
                  className="w-full"
                  id={`phoneNumber-${index}`}
                  type="phoneNumber"
                  value={driver.phoneNumber}
                  onChange={(e) =>
                    handleDriverChange(index, "phoneNumber", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`zipCode-${index}`}>Zip Code</InputLabel>
                <TextField
                  className="w-full"
                  id={`zipCode-${index}`}
                  type="number"
                  value={driver.zipCode}
                  onChange={(e) =>
                    handleDriverChange(index, "zipCode", e.target.value)
                  }
                />
              </div>
            </div>
            {index > 0 && (
              <div
                key={index + 1}
                className="w-full flex flex-col mt-[20px] mb-[20px] justify-center items-center"
              >
                <Tooltip title={`Delete ${driver.email}`}>
                  <InputAdornment onClick={() => handleRemoveDriver(index)}>
                    <IconButton>
                      <RiDeleteBin5Fill size={20} />
                    </IconButton>
                  </InputAdornment>
                </Tooltip>
              </div>
            )}
          </>
        ))}

        <div className="w-full flex flex-col justify-center items-center">
          <button
            onClick={handleAddDriver}
            className="bg-[#F77F00] w-full text-white py-3 font-semibold rounded-md outline-none px-3 md:[80%] lg:w-[40%] flex flex-row justify-center items-center gap-2"
          >
            <img src={plusicon} alt="" />{" "}
            <span className="text-[12px] md:text-[16px]">
              Add Another Driver
            </span>
          </button>
        </div>

        <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
          <div className="flex w-full flex-col justify-center items-start gap-2">
            <InputLabel htmlFor="mailingAddress">Mailing Address</InputLabel>
            <TextField
              value={formData.mailingAddress}
              onChange={(e) => handleChange(e)}
              name="mailingAddress"
              className="w-full"
              id="mailingAddress"
              label="Type your Mailing Address here......"
              variant="outlined"
            />
          </div>
          <div className="flex w-full flex-col justify-center items-start gap-2">
            <InputLabel htmlFor="occupancy-select">Occupancy</InputLabel>
            <FormControl className="w-full" variant="outlined">
              <Select
                labelId="occupancy-select-label"
                id="occupancy-select"
                value={formData.occupancy}
                onChange={(e) => handleChange(e)}
                name="occupancy"
              >
                <MenuItem value="Primary">Primary</MenuItem>
                <MenuItem value="Rental">Rental</MenuItem>
                <MenuItem value="Seasonal/Secondary">
                  Seasonal/Secondary
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="w-full flex lg:flex-row gap-5 lg:gap-20 flex-col justify-center lg:justify-start items-center">
          <div className="flex w-full lg:w-[50%] flex-col justify-center items-start gap-2">
            <InputLabel htmlFor="garaging_address">Garaging Address</InputLabel>
            <TextField
              value={formData.garaging_address}
              onChange={(e) => handleChange(e)}
              name="garaging_address"
              className="w-full"
              id="garaging_address"
              label="Type your Address here......"
              variant="outlined"
            />
          </div>
          {/* <div className='flex w-full lg:w-[50%] flex-row pt-5 gap-2 justify-start items-center'>
                        <input value={formData.mailing} checked={formData.mailing} name="mailing"
                            onChange={(e) => handleChange(e)} className='w-[20px] h-[20px]' type="checkbox" id="mailing" />
                        <InputLabel htmlFor="mailing">Same as Mailing Address</InputLabel>
                    </div> */}
        </div>

        {formData.vehicles.map((vehicle, index) => (
          <>
            <div
              key={index}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-20 justify-center lg:justify-start items-center"
            >
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`binary-select1-${index}`}>
                  VIN available?
                </InputLabel>
                <FormControl className="w-full" variant="outlined">
                  <InputLabel id={`binary-select1-${index}`}>
                    Yes / No
                  </InputLabel>
                  <Select
                    labelId={`binary-select-label-${index}`}
                    id={`binary-select1-${index}`}
                    value={vehicle.vin}
                    onChange={(e) =>
                      handleVehicleChange(index, "vin", e.target.value)
                    }
                    label="Yes / No"
                    name={`vin-${index}`}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>

                {vehicle.vin === "yes" && (
                  <>
                    <InputLabel htmlFor={`vin_number-${index}`}>
                      VIN Number
                    </InputLabel>
                    <TextField
                      className="w-full"
                      id={`vin_number-${index}`}
                      type="text"
                      value={vehicle.vin_number}
                      onChange={(e) =>
                        handleVehicleChange(index, "vin_number", e.target.value)
                      }
                    />
                  </>
                )}

                {vehicle.vin === "no" && (
                  <>
                    <TextField
                      className="w-full"
                      id={`v_make-${index}`}
                      type="text"
                      placeholder="Type your Make here......"
                      value={vehicle.v_make}
                      onChange={(e) =>
                        handleVehicleChange(index, "v_make", e.target.value)
                      }
                    />
                    <TextField
                      className="w-full"
                      id={`v_model-${index}`}
                      placeholder="Type your Model here......"
                      type="text"
                      value={vehicle.v_model}
                      onChange={(e) =>
                        handleVehicleChange(index, "v_model", e.target.value)
                      }
                    />
                    <TextField
                      className="w-full"
                      id={`v_year-${index}`}
                      placeholder="Type your Year here......"
                      type="text"
                      value={vehicle.v_year}
                      onChange={(e) =>
                        handleVehicleChange(index, "v_year", e.target.value)
                      }
                    />
                  </>
                )}
              </div>

              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`binary-select1-${index}`}>
                  Insurance currently in place?
                </InputLabel>
                <FormControl className="w-full" variant="outlined">
                  <InputLabel id={`binary-select1-${index}`}>
                    Yes / No
                  </InputLabel>
                  <Select
                    labelId={`binary-select-label-${index}`}
                    id={`binary-select1-${index}`}
                    value={vehicle.current_insurance}
                    onChange={(e) =>
                      handleVehicleChange(
                        index,
                        "current_insurance",
                        e.target.value
                      )
                    }
                    label="Yes / No"
                    name={`current_insurance-${index}`}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>

                {vehicle.current_insurance === "yes" && (
                  <>
                    <InputLabel htmlFor={`exp-date`}>
                      Expiration Date
                    </InputLabel>
                    <TextField
                      className="w-full"
                      id={`expiration_date-${index}`}
                      type="date"
                      value={vehicle.expiration_date}
                      onChange={(e) =>
                        handleVehicleChange(
                          index,
                          "expiration_date",
                          e.target.value
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col justify-center items-start gap-2">
              <InputLabel htmlFor={`v_garaging_address-${index}`}>
                Garaging Address
              </InputLabel>
              <FormControl className="w-full" variant="outlined">
                <InputLabel id={`v_garaging_address-${index}`}>
                  Same as Main Address? (Yes / No)
                </InputLabel>
                <Select
                  labelId={`v_garaging_address-label-${index}`}
                  id={`v_garaging_address-${index}`}
                  value={vehicle.v_garaging_address}
                  onChange={(e) =>
                    handleVehicleChange(
                      index,
                      "v_garaging_address",
                      e.target.value
                    )
                  }
                  label="Yes / No"
                  name={`v_garaging_address-${index}`}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>

              {vehicle.v_garaging_address === "no" && (
                <TextField
                  className="w-full"
                  id={`v_garaging_address_input-${index}`}
                  type="text"
                  label="Type your vehicle address here..."
                  value={vehicle.v_garaging_address_input}
                  onChange={(e) =>
                    handleVehicleChange(
                      index,
                      "v_garaging_address_input",
                      e.target.value
                    )
                  }
                />
              )}

              {vehicle.v_garaging_address === "yes" && (
                <TextField
                  className="w-full"
                  id={`v_garaging_address_input-${index}`}
                  type="text"
                  value={formData.garaging_address}
                  disabled
                />
              )}
            </div>
          </>
        ))}

        <div className="w-full flex flex-col justify-center items-center">
          <button
            onClick={handleAddVehicle}
            className="bg-[#F77F00] w-full text-white py-3 font-semibold rounded-md outline-none px-3 md:[80%] lg:w-[40%] flex flex-row justify-center items-center gap-2"
          >
            <img src={plusicon} alt="" />{" "}
            <span className="text-[12px] md:text-[16px]">
              Add Another Vehicle
            </span>
          </button>
        </div>

        <div className="w-full flex flex-col gap-10 mt-[20px] mb-[20px] justify-center items-center">
          <h2 className="font-bold text-center md:text-[24px] text-black">
            Coverage Section <span className="font-light">(Optional)</span>
          </h2>
          <div className="w-full gap-y-5 grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center items-center">
            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Bodily Injury Limit
              </InputLabel>
              <Select
                id="bodily_injury_limit"
                value={formData.bodily_injury_limit}
                onChange={(e) => handleChange(e)}
                label="Bodily Injury Limit"
                name="bodily_injury_limit"
              >
                <MenuItem value="10/20">10 / 20</MenuItem>
                <MenuItem value="25/50">25 / 50</MenuItem>
                <MenuItem value="100/300">100 / 300</MenuItem>
                <MenuItem value="250/500">250 / 500</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Property Damage
              </InputLabel>
              <Select
                id="property_damage"
                value={formData.property_damage}
                onChange={(e) => handleChange(e)}
                label="Property Damage"
                name="property_damage"
              >
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="50">50</MenuItem>
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Uninsured Motorists/ UM
              </InputLabel>
              <Select
                id="UM"
                value={formData.UM}
                onChange={(e) => handleChange(e)}
                label="Uninsured Motorists/ UM"
                name="UM"
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="10/20">10 / 20</MenuItem>
                <MenuItem value="25/50">25 / 50</MenuItem>
                <MenuItem value="100/300">100 / 300</MenuItem>
                <MenuItem value="250/500">250 / 500</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Comprehensive Deductible
              </InputLabel>
              <Select
                id="comprehensive_deductible"
                value={formData.comprehensive_deductible}
                onChange={(e) => handleChange(e)}
                label="Comprehensive Deductible"
                name="comprehensive_deductible"
              >
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="200">200</MenuItem>
                <MenuItem value="500">500</MenuItem>
                <MenuItem value="1000">1000</MenuItem>
                <MenuItem value="2000">2000</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Collision Deductible
              </InputLabel>
              <Select
                id="collision_deductible"
                value={formData.collision_deductible}
                onChange={(e) => handleChange(e)}
                label="Collision Deductible"
                name="collision_deductible"
              >
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="200">200</MenuItem>
                <MenuItem value="500">500</MenuItem>
                <MenuItem value="1000">1000</MenuItem>
                <MenuItem value="2000">2000</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="w-full flex flex-col gap-10 mt-[20px] mb-[20px] justify-center items-center">
          <h2 className="font-bold text-center md:text-[24px] text-black">
            Upload Current Declarations Page{" "}
            <span className="font-light">(Optional)</span>
          </h2>
          <div className="flex w-full flex-col justify-center items-center gap-2">
            <button
              onClick={() => setfileModal(true)}
              className="bg-white md:w-[45%] border-[1px] border-black text-black font-extralight w-full py-2 px-4 rounded"
            >
              + Upload Inspections
            </button>
          </div>
        </div>

        <div className="w-full flex lg:flex-row gap-5 lg:gap-20 flex-col justify-center lg:justify-end items-center">
          <button
            onClick={checkInspections}
            className="px-5 bg-[#17A600] flex flex-row justify-center items-center gap-2 py-3 rounded-md font-bold text-[22px] text-white"
          >
            <span>{buttonstate}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>

        <Modal open={fileModal} onClose={() => setfileModal(false)}>
          <Box
            className="w-[90%] md:w-[50%]"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div>
              <div {...getRootProps()} style={{ cursor: "pointer" }}>
                <input {...getInputProps()} />
                <label className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto">
                  {files.length === 0 ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 mb-2 fill-gray-500"
                        viewBox="0 0 32 32"
                      >
                        <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                        <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                      </svg>
                      Upload file
                      <p className="text-xs text-center px-2 font-medium text-gray-400 mt-2">
                        PNG, JPG, SVG, WEBP, and GIF are Allowed.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-full flex flex-col justify-center items-center gap-2">
                        <p className="font-semibold text-center text-[12px]">
                          Files selected successfully...
                        </p>
                        <p className="font-light text-center text-[11px]">
                          Click outside to close modal...
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-2 mb-2">
                  <h2 className="mt-1 mb-1 italic font-semibold">
                    Selected Files:
                  </h2>
                  <ul className="grid lg:grid-cols-2 gap-2 grid-cols-1">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center">
                          {file.type.includes("image") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`File ${index + 1}`}
                              className="w-8 h-8 mr-2 rounded"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 mr-2 fill-current text-gray-500"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H5z"
                              />
                            </svg>
                          )}
                          <span
                            className="max-w-[150px] truncate"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 px-2 py-1 text-sm text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                        >
                          <CiCircleRemove size={28} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Box>
        </Modal>
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Submit Quote Without Inspections?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to submit the quote without inspections?
            </DialogContentText>
            <DialogContentText
              sx={{
                fontSize: "14px",
                marginTop: "10px",
              }}
              id="alert-dialog-description"
            >
              Note: The request will be submitted but your quote will not begin
              until the inspections are uploaded.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button
              onClick={addFormToDb}
              className="px-5 bg-[#17A600] flex flex-row justify-center items-center gap-2 py-3 rounded-md font-bold text-white"
            >
              Upload Anyway
            </button>
            <button
              onClick={() => setConfirmDialogOpen(false)}
              className="px-5 bg-[#F77F00] flex flex-row justify-center items-center gap-2 py-3 rounded-md font-bold text-white"
            >
              Add Inspections
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AutoForm;
