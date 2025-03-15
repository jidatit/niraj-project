import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import plusicon from "../../../assets/dash/plus.png";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import infoicon from "../../../assets/dash/info.png";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { db } from "../../../../db";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../AuthContext";
import { ClientQuoteReqMail } from "../../../utils/mailingFuncs";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IconButton, InputAdornment } from "@mui/material";

const LiabilityForm = ({ selectedUser }) => {
  const navigate = useNavigate();
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

  const redirectFunc = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  let { currentUser } = useAuth();
  currentUser = selectedUser
    ? { uid: selectedUser?.id, data: selectedUser }
    : currentUser;
  const isClient = currentUser?.data?.signupType === "Client";
  const [formData, setFormData] = useState({
    policyType: "Liability",
    application_policy: "",
    address_num: "",
    owner_occupied_num: "",
    rented_address_num: "",
    coverageAmount: "",
    mailingAddress: isClient ? currentUser?.data?.mailingAddress || "" : "",
    persons: isClient
      ? [
          {
            name: currentUser?.data?.name || "",
            dob: currentUser?.data?.dateOfBirth || "",
            email: currentUser?.data?.email || "",
            phoneNumber: currentUser?.data?.phoneNumber || "",
            zipCode: currentUser?.data?.zipCode || "",
          },
        ]
      : [
          {
            name: "",
            dob: "",
            email: "",
            phoneNumber: "",
            zipCode: "",
          },
        ],
    addresses: [{ address: "" }],
    autos: { cars: "", boats: "", motorcycles: "", golf_carts: "" },
    user: { ...currentUser.data, id: currentUser.uid },
    occupancy: "Primary",
  });

  const [buttonstate, setbuttonstate] = useState("Submit");

  const addFormToDb = async () => {
    try {
      setbuttonstate("Submitting...");
      await addDoc(collection(db, "liability_quotes"), {
        ...formData,
        address: formData.mailingAddress,
        status: "completed",
        status_step: "1",
        inuser: formData.persons[0],
        ...(currentUser?.data?.signupType === "Referral" && {
          byReferral: true,
          ReferralId: currentUser?.uid,
          Referral: currentUser?.data,
        }),
        createdAt: serverTimestamp(), // Automatically add the creation timestamp
        updatedAt: serverTimestamp(), // Set the initial update timestamp to the same as createdAt
      });

      setFormData({
        policyType: "Liability",
        application_policy: "",
        address_num: "",
        owner_occupied_num: "",
        rented_address_num: "",
        coverageAmount: "",
        mailingAddress: "",
        persons: [
          { name: "", dob: "", email: "", phoneNumber: "", zipCode: "" },
        ],
        addresses: [{ address: "" }],
        autos: { cars: "", boats: "", motorcycles: "", golf_carts: "" },
        user: { ...currentUser.data, id: currentUser.uid },
        status: "completed",
        status_step: "1",
        occupancy: "Primary",
      });

      if (currentUser.data.signupType === "Referral") {
        ClientQuoteReqMail(
          formData.persons.map((driver) => driver.name).join(", "), // Concatenate all names
          adminEmail,
          "Liability",
          currentUser.data.name,
          currentUser.data.name
        );
      } else {
        ClientQuoteReqMail(
          formData.persons.map((driver) => driver.name).join(", "), // Concatenate all names
          adminEmail,
          "Liability",
          "None",
          currentUser.data.name
        );
      }
      // ClientQuoteReqMail(currentUser.data.name, adminEmail, "Liability");

      toast.success("Application submitted with success.");
      setbuttonstate("Submit");
      if (!selectedUser) {
        redirectFunc("/user_portal");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application.");
      setbuttonstate("Submit");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeAutos = (event, vehicleType) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      autos: {
        ...prevData.autos,
        [vehicleType]: value,
      },
    }));
  };

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index].address = value;
    setFormData((prevData) => ({
      ...prevData,
      addresses: updatedAddresses,
    }));
  };

  const handleAddAddress = () => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: [...prevData.addresses, { address: "" }],
    }));
  };

  const handleAddPerson = () => {
    setFormData((prevData) => ({
      ...prevData,
      persons: [
        ...prevData.persons,
        { name: "", dob: "", email: "", phoneNumber: "", zipCode: "" },
      ],
    }));
  };

  const handleRemovePerson = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      persons: prevData.persons.filter((_, i) => i !== index),
    }));
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...formData.persons];
    updatedPersons[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      persons: updatedPersons,
    }));
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 320,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <ToastContainer />
        <div className="w-full flex flex-col justify-center items-start">
          <h1 className="font-bold lg:text-[25px]">
            Fill out Form for Liability Quote
          </h1>
        </div>

        {formData.persons.map((person, index) => (
          <>
            <div
              key={index}
              className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center"
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
                  value={person.name}
                  onChange={(e) =>
                    handlePersonChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`date-${index}`}>Date of Birth</InputLabel>
                <TextField
                  className="w-full"
                  id={`date-${index}`}
                  type="date"
                  value={person.dob}
                  onChange={(e) =>
                    handlePersonChange(index, "dob", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`email-${index}`}>Email</InputLabel>
                <TextField
                  className="w-full"
                  id={`email-${index}`}
                  type="email"
                  value={person.email}
                  onChange={(e) =>
                    handlePersonChange(index, "email", e.target.value)
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
                  value={person.phoneNumber}
                  onChange={(e) =>
                    handlePersonChange(index, "phoneNumber", e.target.value)
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`zipCode-${index}`}>Zip Code</InputLabel>
                <TextField
                  className="w-full"
                  id={`zipCode-${index}`}
                  type="number"
                  value={person.zipCode}
                  onChange={(e) =>
                    handlePersonChange(index, "zipCode", e.target.value)
                  }
                />
              </div>
            </div>
            {index > 0 && (
              <div
                key={index + 1}
                className="w-full flex flex-col mt-[20px] mb-[20px] justify-center items-center"
              >
                <Tooltip title={`Delete ${person.email}`}>
                  <InputAdornment onClick={() => handleRemovePerson(index)}>
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
            onClick={handleAddPerson}
            className="bg-[#F77F00] w-full text-white py-3 font-semibold rounded-md outline-none px-3 md:[80%] lg:w-[40%] flex flex-row justify-center items-center gap-2"
          >
            <img src={plusicon} alt="" />{" "}
            <span className="text-[12px] md:text-[16px]">
              Add Another Person
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

        <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
          <div className="w-full flex flex-col justify-start items-center gap-3">
            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Type of Policy
              </InputLabel>
              <Select
                id="application_policy"
                value={formData.application_policy}
                onChange={(e) => handleChange(e)}
                label="Application Policy Type"
                name="application_policy"
              >
                <MenuItem value="liability">
                  <HtmlTooltip
                    title={
                      <>
                        <div className="flex w-full flex-row justify-center items-center gap-2">
                          <img src={infoicon} alt="" />
                          <div className="flex flex-col justify-center items-start gap-1">
                            <p className="text-[12px] font-light">
                              (Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit.)
                            </p>
                            <p className="text-[12px] font-light">
                              (Aenean commodo ligula eget dolor. Aenean massa.)
                            </p>
                          </div>
                        </div>
                      </>
                    }
                  >
                    <p className="w-full">Liability</p>
                  </HtmlTooltip>
                </MenuItem>
                <MenuItem value="umbrella">
                  <HtmlTooltip
                    title={
                      <>
                        <div className="flex w-full flex-row justify-center items-center gap-2">
                          <img src={infoicon} alt="" />
                          <div className="flex flex-col justify-center items-start gap-1">
                            <p className="text-[12px] font-light">
                              (Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit.)
                            </p>
                            <p className="text-[12px] font-light">
                              (Aenean commodo ligula eget dolor. Aenean massa.)
                            </p>
                          </div>
                        </div>
                      </>
                    }
                  >
                    <p className="w-full">Umbrella</p>
                  </HtmlTooltip>
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="w-full flex flex-col justify-start items-center gap-3">
            <FormControl className="w-full" variant="outlined">
              <InputLabel id="demo-simple-select-label">
                Amount of Coverage Desired
              </InputLabel>
              <Select
                id="coverageAmount"
                value={formData.coverageAmount}
                onChange={(e) => handleChange(e)}
                label="Amount of Coverage Desired"
                name="coverageAmount"
              >
                <MenuItem value="300K">300K</MenuItem>
                <MenuItem value="500K">500K</MenuItem>
                <MenuItem value="1M">1M</MenuItem>
                <MenuItem value="2M">2M</MenuItem>
                <MenuItem value="3M">3M</MenuItem>
                <MenuItem value="4M">4M</MenuItem>
                <MenuItem value="5M">5M</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {formData.application_policy === "liability" &&
          formData.addresses.map((address, index) => (
            <div
              className="w-full mt-[20px] mb-[20px] justify-start items-center"
              key={index}
            >
              <TextField
                className="md:w-[49%] w-full"
                id={`address-${index}`}
                placeholder="Type your Address here......"
                variant="outlined"
                value={address.address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
              />
            </div>
          ))}

        {formData.application_policy === "umbrella" && (
          <>
            <div className="w-full grid flex-wrap grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              <TextField
                className="w-full"
                id="address_num"
                name="address_num"
                type="number"
                placeholder="Enter number of addresses"
                variant="outlined"
                value={formData.address_num}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                className="w-full"
                id="owner_occupied_num"
                name="owner_occupied_num"
                type="number"
                placeholder="How many are owner occupied"
                variant="outlined"
                value={formData.owner_occupied_num}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                className="w-full"
                id="rented_address_num"
                name="rented_address_num"
                type="number"
                placeholder="How many are Rented"
                variant="outlined"
                value={formData.rented_address_num}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center mt-[20px] mb-[20px]">
              <div className="lg:w-[90%] w-full flex flex-col justify-center items-center rounded-lg border-[1px] border-black p-2">
                <div className="flex flex-row mt-[20px] mb-[20px] md:w-[70%] justify-between w-full font-bold">
                  <div className="w-1/2">Vehicle Type</div>
                  <div className="w-1/2">No. of Vehicles</div>
                </div>
                <div className="h-[1px] w-full mb-[20px] mt-[20px] bg-black"></div>
                <div className="flex flex-row md:w-[70%] justify-center items-center w-full pb-2">
                  <div className="w-1/2">
                    <label htmlFor="cars">Cars:</label>
                  </div>
                  <div className="w-1/2">
                    <TextField
                      type="number"
                      value={formData.autos.cars}
                      onChange={(e) => handleChangeAutos(e, "cars")}
                      id="cars"
                      name="cars"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </div>
                </div>
                <div className="h-[1px] w-full mb-[20px] mt-[20px] bg-black"></div>
                <div className="flex flex-row md:w-[70%] justify-center items-center w-full mb-2 pb-2">
                  <div className="w-1/2">
                    <label htmlFor="motorcycles">Motorcycles:</label>
                  </div>
                  <div className="w-1/2">
                    <TextField
                      value={formData.autos.motorcycles}
                      onChange={(e) => handleChangeAutos(e, "motorcycles")}
                      type="number"
                      id="motorcycles"
                      name="motorcycles"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </div>
                </div>
                <div className="h-[1px] w-full mb-[20px] mt-[20px] bg-black"></div>
                <div className="flex flex-row md:w-[70%] justify-center items-center w-full mb-2 pb-2">
                  <div className="w-1/2">
                    <label htmlFor="Boats">Boats:</label>
                  </div>
                  <div className="w-1/2">
                    <TextField
                      value={formData.autos.boats}
                      onChange={(e) => handleChangeAutos(e, "boats")}
                      type="number"
                      id="boats"
                      name="boats"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </div>
                </div>
                <div className="h-[1px] w-full mb-[20px] mt-[20px] bg-black"></div>
                <div className="flex flex-row md:w-[70%] justify-center items-center w-full mb-2 pb-2">
                  <div className="w-1/2">
                    <label htmlFor="Golf Carts">Golf Carts:</label>
                  </div>
                  <div className="w-1/2">
                    <TextField
                      value={formData.autos.golf_carts}
                      onChange={(e) => handleChangeAutos(e, "golf_carts")}
                      type="number"
                      id="golf_carts"
                      name="golf_carts"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {formData.application_policy === "liability" && (
          <div className="w-full flex flex-col justify-center items-center">
            <button
              onClick={handleAddAddress}
              className="bg-[#F77F00] w-full text-white py-3 font-semibold rounded-md outline-none px-3 md:[80%] lg:w-[40%] flex flex-row justify-center items-center gap-2"
            >
              <img src={plusicon} alt="" />{" "}
              <span className="text-[12px] md:text-[16px]">
                Add Another Address
              </span>
            </button>
          </div>
        )}

        <div className="w-full flex lg:flex-row gap-5 lg:gap-20 flex-col justify-center lg:justify-end items-center">
          <button
            onClick={addFormToDb}
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
      </div>
    </>
  );
};

export default LiabilityForm;
