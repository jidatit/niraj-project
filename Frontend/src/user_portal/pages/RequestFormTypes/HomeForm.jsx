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
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { CiCircleRemove } from "react-icons/ci";

const HomeForm = () => {
  const navigate = useNavigate();

  const redirectFunc = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const isClient = currentUser?.data?.signupType === "Client";

  const [formData, setFormData] = useState({
    policyType: "Home",
    address: "",
    mailing: false,
    ishomebuild: "",
    newPurchase: "",
    closingDate: "",
    currentInsurance: "",
    expiryDate: "",
    isCondo: "",
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
      : [{ name: "", dob: "", email: "", phoneNumber: "", zipCode: "" }],
    files: [],
    user: { ...currentUser.data, id: currentUser.uid },
    occupancy: "Primary",
  });

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
    if (formData.ishomebuild === "") {
      toast.warn("is this home built before 2005?");
      return;
    }
    if (
      formData.ishomebuild === "yes" &&
      formData.files.length === 0 &&
      formData.isCondo === "no"
    ) {
      setConfirmDialogOpen(true);
    } else {
      addFormToDb();
    }
  };

  const addFormToDb = async () => {
    try {
      setConfirmDialogOpen(false);
      setbuttonstate("Submitting...");

      const isCondo = formData.isCondo === "yes";
      const isHomeBuild = formData.ishomebuild === "yes";
      let status = "completed"; // Default status is "completed"
      let status_step = "1"; // Default status_step

      // If isHomeBuild is "yes" and no files are uploaded, set status to "pending"
      if (isHomeBuild && files.length === 0) {
        status = "pending"; // Set status to "pending" when isHomeBuild is "yes" and no files
      }

      if (isCondo) {
        // If isCondo is "yes", ignore file uploads and set status to "completed"
        status = "completed";
      }

      let formDataToSave = {
        ...formData,
        status: status,
        status_step: status_step,
      };

      // Handle form data submission without file uploads for isCondo = "yes"
      if (isCondo || files.length === 0) {
        formDataToSave = {
          ...formDataToSave,
          files: [], // Ensure files are cleared
        };

        // Also clear files in formData state
        setFormData((prevData) => ({
          ...prevData,
          files: [], // Clear files when isCondo is "yes" or no files
        }));
        await addDoc(collection(db, "home_quotes"), {
          ...formDataToSave,
          inuser: formDataToSave.persons[0],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...(currentUser.data.signupType === "Referral" && {
            byReferral: true,
          }),
        });

        // Send email based on isHomeBuild value
        if (isHomeBuild) {
          ClientQuoteWithoutInspection(
            formData.persons.map((driver) => driver.name).join(", "),
            adminEmail,
            "Home",
            currentUser.data.signupType === "Referral"
              ? currentUser.data.name
              : "None",
            currentUser.data.name
          );
        } else {
          ClientQuoteReqMail(
            formData.persons.map((driver) => driver.name).join(", "),
            adminEmail,
            "Home",
            currentUser.data.signupType === "Referral"
              ? currentUser.data.name
              : "None",
            currentUser.data.name
          );
        }

        toast.success("Application submitted successfully.");
        setbuttonstate("Submit");
        redirectFunc("/user_portal");
        return;
      }

      // If files need to be uploaded (isCondo = "no" and files exist)
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2);
      const promises = files.map(async (file) => {
        const storageRef = ref(
          storage,
          `home_quotes/${timestamp}_${uniqueId}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const fileUrls = await Promise.all(promises);

      let formDataWithUrls = {
        ...formData,
        files: fileUrls.map((url) => ({ file: url })),
        status: "completed", // Ensure status is "completed" when files are uploaded
        status_step: "1",
      };

      await addDoc(collection(db, "home_quotes"), {
        ...formDataWithUrls,
        inuser: formDataWithUrls.persons[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(currentUser.data.signupType === "Referral" && { byReferral: true }),
      });

      // Send email based on isHomeBuild value
      if (isHomeBuild) {
        ClientQuoteWithoutInspection(
          formData.persons.map((driver) => driver.name).join(", "),
          adminEmail,
          "Home",
          currentUser.data.signupType === "Referral"
            ? currentUser.data.name
            : "None",
          currentUser.data.name
        );
      } else {
        ClientQuoteReqMail(
          formData.persons.map((driver) => driver.name).join(", "),
          adminEmail,
          "Home",
          currentUser.data.signupType === "Referral"
            ? currentUser.data.name
            : "None",
          currentUser.data.name
        );
      }

      setFormData({
        policyType: "Home",
        address: "",
        mailing: false,
        ishomebuild: "",
        isCondo: "",
        newPurchase: "",
        closingDate: "",
        currentInsurance: "",
        expiryDate: "",
        mailingAddress: "",
        persons: [
          { name: "", dob: "", email: "", phoneNumber: "", zipCode: "" },
        ],
        files: [],
        user: { ...currentUser.data, id: currentUser.uid },
        occupancy: "Primary",
      });
      setFiles([]);

      toast.success("Application submitted successfully.");
      setbuttonstate("Submit");
      redirectFunc("/user_portal");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application.");
      setbuttonstate("Submit");
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "mailing") {
      setFormData((prevData) => ({
        ...prevData,
        mailing: checked,
        address: checked ? currentUser.data.mailingAddress : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
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

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <ToastContainer />
        <div className="w-full flex flex-col justify-center items-start">
          <h1 className="font-bold lg:text-[25px]">
            Fill out Form for Home Quote
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
        </div>
        <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
          <div className="flex w-full flex-col justify-center items-start gap-2">
            <InputLabel htmlFor="address">Address to be insured</InputLabel>
            <TextField
              value={formData.address}
              onChange={(e) => handleChange(e)}
              name="address"
              className="w-full"
              id="address"
              label="Type your Address here......"
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

          {/* <div className="flex w-full flex-row pt-5 gap-2 justify-start items-center">
            <input
              value={formData.mailing}
              checked={formData.mailing}
              name="mailing"
              onChange={handleChange}
              className="w-[20px] h-[20px]"
              type="checkbox"
              id="mailing"
            />
            <InputLabel htmlFor="mailing">Same as Mailing Address</InputLabel>
          </div> */}
        </div>
        <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
          <div className="flex w-full flex-col justify-center items-start gap-2">
            <InputLabel htmlFor="binary-select1">
              Is this home built before 2005?
            </InputLabel>
            <FormControl className="w-full" variant="outlined">
              <InputLabel id="binary-select1">Yes / No</InputLabel>
              <Select
                labelId="binary-select-label"
                id="binary-select1"
                value={formData.ishomebuild}
                onChange={(e) => handleChange(e)}
                label="Yes / No"
                name="ishomebuild"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex w-full flex-col gap-2 justify-center items-start">
            <InputLabel htmlFor="binary-select2">New Purchase?</InputLabel>
            <FormControl className="w-full" variant="outlined">
              <InputLabel id="binary-select2">Yes / No</InputLabel>
              <Select
                labelId="binary-select-label"
                id="binary-select2"
                value={formData.newPurchase}
                onChange={(e) => handleChange(e)}
                label="Yes / No"
                name="newPurchase"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6 mb-6 ">
          {/* ✅ Is Condo Select Dropdown */}
          <div className="flex flex-col gap-2">
            <InputLabel htmlFor="isCondo-select" className="text-gray-700">
              Is this home a condo? (Optional)
            </InputLabel>
            <FormControl className="w-full" variant="outlined">
              <InputLabel id="binary-select2">Yes / No</InputLabel>
              <Select
                labelId="isCondo-select-label"
                id="isCondo-select"
                value={formData.isCondo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, isCondo: e.target.value })
                }
                label="Yes / No"
                name="isCondo"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* ✅ Upload Inspection Button (Hidden if isCondo is "yes") */}
          {formData.isCondo !== "yes" && (
            <div className="flex flex-col items-center justify-center gap-3 p-4 ">
              <h3 className="text-center text-sm font-semibold text-gray-700">
                Upload 4 Point / Wind Mitigation Inspections
                {formData?.ishomebuild === "no" && "  (Optional)"}
              </h3>
              <button
                onClick={() => setfileModal(true)}
                className="bg-white md:w-[45%] border-[1px] border-black text-black font-extralight w-full py-2 px-4 rounded"
              >
                + Upload Inspections
              </button>
            </div>
          )}

          {/* ✅ Closing Date Field (Consistent Layout) */}
          {formData.newPurchase === "yes" && (
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="closing-date" className="text-gray-700">
                Closing Date
              </InputLabel>
              <TextField
                className="w-full"
                id="closingDate"
                type="date"
                value={formData.closingDate}
                onChange={(e) => handleChange(e)}
                name="closingDate"
              />
            </div>
          )}

          {/* ✅ Insurance Selection (Consistent Layout) */}
          {formData.newPurchase === "no" && (
            <div className="flex flex-col gap-2">
              <InputLabel htmlFor="binary-select3" className="text-gray-700">
                Insurance Currently in place?
              </InputLabel>
              <FormControl className="w-full" variant="outlined">
                <Select
                  labelId="binary-select-label"
                  id="binary-select3"
                  value={formData.currentInsurance}
                  onChange={(e) => handleChange(e)}
                  name="currentInsurance"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </div>
        {formData.newPurchase === "no" &&
          formData.currentInsurance === "yes" && (
            <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              <div className="flex w-full flex-col justify-center items-start gap-2">
                <InputLabel htmlFor={`exp-date`}>Expiration Date</InputLabel>
                <TextField
                  className="w-full"
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange(e)}
                  name="expiryDate"
                />
              </div>
            </div>
          )}
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
                  <ul className="grid  gap-2 grid-cols-1">
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
                            className="max-w-[250px] md:max-w-[300px] truncate"
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

export default HomeForm;
