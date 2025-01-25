import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { db, storage } from "../../../db";
import { Modal, Slide, Box, TextField } from "@mui/material";
import Tooltip from "@mui/material/Tooltip"; // Importing MUI Tooltip
import resicon from "../../assets/dash/modal/res.png";
import progicon from "../../assets/dash/modal/prog.png";
import viewicon from "../../assets/dash/modal/view.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import img1 from "../../assets/dash/user/1.png";
import img2 from "../../assets/dash/user/2.png";
import img3 from "../../assets/dash/user/3.png";
import { useDropzone } from "react-dropzone";
import img4 from "../../assets/dash/user/4.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "../components/Button";
import LineGraph from "../components/LineGraph";
import tickicon from "../../.../../assets/dash/tick.png";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle,
  CancelOutlined,
} from "@mui/icons-material";
import {
  ClientQuoteInspectionUploaded,
  ClientQuotePolicyCancelMail,
  ClientQuotePolicyChangeMail,
  ClientQuoteReqMail,
} from "../../utils/mailingFuncs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import newlogo from "../../assets/newlogo.png";
import PolicyDetailsModal from "../components/PolicyDetailsModal";

const ViewPolicyQuote = () => {
  const [AllQuotes, setAllQuotes] = useState([]);
  const { currentUser } = useAuth();
  const isClient = currentUser?.data?.signupType === "Client";
  const [openModal, setopenModal] = useState(false);
  const [PopupData, setPopupData] = useState();
  const [openModalPolicy, setopenModalPolicy] = useState(false);
  const [PopupDataPolicy, setPopupDataPolicy] = useState();
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false); // New modal state
  const [selectedRowData, setSelectedRowData] = useState(null);
  const isReferral = currentUser?.data?.signupType === "Referral";
  //   const [anchorEl, setAnchorEl] = useState(null);
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
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleOpenInspectionModal = (rowData) => {
    setSelectedRow(rowData);

    setIsInspectionModalOpen(true);
  };

  const handleCloseInspectionModal = () => {
    setIsInspectionModalOpen(false);
    setSelectedRow(null);
    setFiles([]);
  };
  const handleUploadInspection = async (event) => {
    setLoading(true);
    if (files.length === 0 || !selectedRow) return; // Make sure there are files and a selected row

    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2);

    try {
      // Upload each file and get the download URL
      const promises = Array.from(files).map(async (file) => {
        const storageRef = ref(
          storage,
          `home_quotes/${timestamp}_${uniqueId}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const fileUrls = await Promise.all(promises);

      // Prepare the data with file URLs
      const updatedData = {
        files: fileUrls.map((url) => ({ file: url })),
      };

      // Get the document ID from selectedRow
      // Determine the document type based on the selected policy type
      const documentId = selectedRow.id;
      const policyType = selectedRow.policyType;
      let documentType = ""; // Initialize documentType as an empty string

      switch (policyType) {
        case "Flood":
          documentType = "flood_quotes";
          break;
        case "Liability":
          documentType = "liability_quotes";
          break;
        case "Auto":
          documentType = "auto_quotes";
          break;
        case "Home":
          documentType = "home_quotes";
          break;
        default:
          console.error(`Unknown policy type: ${policyType}`);
          return;
      }

      const docRef = doc(db, documentType, documentId);

      try {
        await updateDoc(docRef, updatedData);
        getUserQuotes();
        setFiles([]);
        toast.success("Files uploaded and document updated successfully!");
        ClientQuoteInspectionUploaded(
          currentUser.data.name,
          adminEmail,
          policyType
        );
      } catch (error) {
        toast.error(`Error updating document: ${error}`);
        console.error("Error updating document: ", error);
      }

      setLoading(false);

      handleCloseInspectionModal();
    } catch (error) {
      setLoading(false);
      toast.error(`Error uploading files or updating document: ${error}`);
      console.error("Error uploading files or updating document:", error);
    }
  };

  const onClose = () => {
    setopenModal(false);
  };

  const onClosePolicy = () => {
    setopenModalPolicy(false);
  };

  const handleOpenModalWithData = (data) => {
    console.log("data", data);
    setSelectedRowData(data);
    setopenModal(true);
    setPopupData(data);
  };
  const handleOpenDetailModal = () => {
    setopenModal(false);
    setOpenDetailModal(true);
  };
  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const handleOpenModalWithDataPolicy = (data) => {
    setopenModalPolicy(true);
    setPopupDataPolicy(data);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "policyType",
        header: "Quote Type",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      ...(isClient
        ? [
            {
              accessorKey: "mailingAddress",
              header: "Mailing Address",
              size: 100,
              Cell: ({ cell }) => (
                <Tooltip title={cell.getValue()} arrow>
                  <Box>
                    {cell.getValue() && cell.getValue().length > 10
                      ? cell.getValue().slice(0, 10) + "..."
                      : cell.getValue()}
                  </Box>
                </Tooltip>
              ),
            },
          ]
        : [
            {
              accessorKey: "persons",
              header: "Names to be Insured",
              size: 100,
              Cell: ({ cell, row }) => {
                const { policyType } = row.original;
                let insuredName = "";

                // Check the quote type and extract the name
                if (policyType === "Home") {
                  insuredName = row.original.persons
                    .map((person) => person.name)
                    .join(", ");
                } else if (policyType === "Auto") {
                  insuredName = row.original.drivers
                    .map((driver) => driver.name)
                    .join(", ");
                } else if (
                  policyType === "Liability" ||
                  policyType === "Flood"
                ) {
                  insuredName = row.original.persons
                    .map((person) => person.name)
                    .join(", ");
                }

                return (
                  <Tooltip title={insuredName} arrow>
                    <Box>
                      {insuredName && insuredName.length > 40
                        ? insuredName.slice(0, 40) + "..."
                        : insuredName}
                    </Box>
                  </Tooltip>
                );
              },
            },
          ]),

      {
        accessorKey: "address",
        header: "Insured Address",
        size: 100,
        Cell: ({ cell }) => (
          <Tooltip title={cell.getValue()} arrow>
            <Box>
              {cell.getValue() && cell.getValue().length > 10
                ? cell.getValue().slice(0, 10) + "..."
                : cell.getValue()}
            </Box>
          </Tooltip>
        ),
      },
      {
        accessorKey: "inspection",
        header: "Inspection",
        size: 100,
        Cell: ({ row }) => {
          const { files, policyType, ishomebuild, cert_elevation } =
            row.original;
          const showUploadInspectionButton =
            files &&
            files.length === 0 &&
            ((policyType === "Home" && ishomebuild === "yes") ||
              policyType === "Auto" ||
              (policyType === "Flood" && cert_elevation === "yes")) &&
            policyType !== "Liability";

          return showUploadInspectionButton ? (
            <div className="flex items-center">
              {/* Red cross mark */}
              <button
                onClick={() => handleOpenInspectionModal(row.original)}
                className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px] lg:text-[14px] lg:font-bold"
              >
                {/* <span className="mr-2 ">
                  <CancelOutlined />
                </span> */}
                Upload Now
              </button>
            </div>
          ) : (
            <span className="text-green-600">
              <CheckCircle />
            </span>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "", // No header for actions column
        size: 200,
        sortable: false,
        Cell: ({ row }) => {
          const { status_step } = row.original;

          return (
            <Box
              display="flex"
              alignItems="center"
              gap="18px"
              sx={{
                "@media (max-width: 1000px)": {
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "flex-start",
                },
              }}
            >
              <button
                disabled={status_step !== "4"}
                onClick={() => handleOpenModalWithDataPolicy(row.original)}
                className={`${
                  status_step !== "4" ? "bg-[#d2ccc4]" : "bg-[#F77F00]"
                } rounded-[18px] px-[16px] py-[4px] text-white text-[10px] lg:text-[14px] lg:font-bold`}
              >
                View Policy
              </button>
              <button
                onClick={() => handleOpenModalWithData(row.original)}
                className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px] lg:text-[14px] lg:font-bold"
              >
                View Quote
              </button>
            </Box>
          );
        },
      },
    ],
    []
  );

  // const getUserQuotes = async () => {
  //   try {
  //     const homeQuotesCollection = collection(db, "home_quotes");
  //     const autoQuotesCollection = collection(db, "auto_quotes");
  //     const liabilityQuotesCollection = collection(db, "liability_quotes");
  //     const floodQuotesCollection = collection(db, "flood_quotes");

  //     const hqsnapshot = await getDocs(homeQuotesCollection);
  //     const aqsnapshot = await getDocs(autoQuotesCollection);
  //     const lqsnapshot = await getDocs(liabilityQuotesCollection);
  //     const fqsnapshot = await getDocs(floodQuotesCollection);

  //     const homeQuotesData = hqsnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     const autoQuotesData = aqsnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     const liabilityQuotesData = lqsnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     const floodQuotesData = fqsnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     let filteredhomeQuotesData =
  //       currentUser &&
  //       homeQuotesData &&
  //       homeQuotesData?.filter((obj) => obj.user.id === currentUser.uid);
  //     let filteredautoQuotesData =
  //       currentUser &&
  //       autoQuotesData &&
  //       autoQuotesData?.filter((obj) => obj.user.id === currentUser.uid);
  //     let filteredliabilityQuotesData =
  //       currentUser &&
  //       liabilityQuotesData &&
  //       liabilityQuotesData?.filter((obj) => obj.user.id === currentUser.uid);
  //     let filteredfloodQuotesData =
  //       currentUser &&
  //       floodQuotesData &&
  //       floodQuotesData?.filter((obj) => obj.user.id === currentUser.uid);

  //     // Combine all quotes
  //     const allQts = [
  //       ...filteredhomeQuotesData,
  //       ...filteredautoQuotesData,
  //       ...filteredliabilityQuotesData,
  //       ...filteredfloodQuotesData,
  //     ];

  //     // Sort by createdAt, latest first
  //     const sortedQuotes = allQts.sort((a, b) => {
  //       const dateA = a.createdAt?.toMillis?.() || 0; // Use 0 if createdAt is missing
  //       const dateB = b.createdAt?.toMillis?.() || 0;

  //       // Sort by createdAt descending, pushing missing dates to the bottom
  //       return dateB - dateA;
  //     });

  //     setAllQuotes(sortedQuotes);
  //   } catch (error) {
  //     toast.error("Error fetching quotes!");
  //   }
  // };

  const getUserQuotes = async () => {
    setLoading(true);
    try {
      const homeQuotesCollection = collection(db, "home_quotes");
      const autoQuotesCollection = collection(db, "auto_quotes");
      const liabilityQuotesCollection = collection(db, "liability_quotes");
      const floodQuotesCollection = collection(db, "flood_quotes");

      const hqsnapshot = await getDocs(homeQuotesCollection);
      const aqsnapshot = await getDocs(autoQuotesCollection);
      const lqsnapshot = await getDocs(liabilityQuotesCollection);
      const fqsnapshot = await getDocs(floodQuotesCollection);

      const homeQuotesData = hqsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const autoQuotesData = aqsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const liabilityQuotesData = lqsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const floodQuotesData = fqsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const emailMatches = (emailsArray) =>
        emailsArray.some((person) => person.email === currentUser.email);

      const filterQuotes = (quotes, userKey, userArrayKey) => {
        return quotes.filter((obj) => {
          const isUserMatch = obj[userKey]?.id === currentUser.uid;
          const isReferralMatch = obj.byReferral
            ? emailMatches(obj[userArrayKey] || [])
            : false;

          return isUserMatch || isReferralMatch;
        });
      };

      let filteredhomeQuotesData = filterQuotes(
        homeQuotesData,
        "user",
        "persons"
      );
      let filteredautoQuotesData = filterQuotes(
        autoQuotesData,
        "user",
        "drivers"
      );
      let filteredliabilityQuotesData = filterQuotes(
        liabilityQuotesData,
        "user",
        "persons"
      );
      let filteredfloodQuotesData = filterQuotes(
        floodQuotesData,
        "user",
        "persons"
      );

      // Combine all quotes
      const allQts = [
        ...filteredhomeQuotesData,
        ...filteredautoQuotesData,
        ...filteredliabilityQuotesData,
        ...filteredfloodQuotesData,
      ];

      // Sort by createdAt, latest first
      const sortedQuotes = allQts.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0; // Use 0 if createdAt is missing
        const dateB = b.createdAt?.toMillis?.() || 0;

        // Sort by createdAt descending, pushing missing dates to the bottom
        return dateB - dateA;
      });

      setAllQuotes(sortedQuotes);
    } catch (error) {
      toast.error("Error fetching quotes!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserQuotes();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <div className="flex justify-end w-full p-4">
          <Link to="/user_portal/requests">
            <button className="bg-[#003049] text-white text-[15px] rounded-[33px] py-2 px-4">
              Request a Quote
            </button>
          </Link>
        </div>

        <div className="flex flex-col mb-4 w-full">
          {/* Table Container */}
          {AllQuotes && (
            <div className="table w-full">
              <MaterialReactTable
                columns={columns}
                data={AllQuotes}
                state={{ isLoading: loading }}
                initialState={{
                  density: "compact",
                  columnOrder: [
                    "Quote Type",
                    "Inspection Status",
                    "Mailing Address",
                    "Address",
                    "Inspection",
                  ],
                }}
              />
            </div>
          )}
        </div>
        <Modal
          open={openModal}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Slide
            direction="right"
            in={openModal}
            mountOnEnter
            unmountOnExit
            style={{ transition: "transform 2s ease-in-out" }}
          >
            <div
              className={`${
                isReferral ? "lg:w-[30%]" : "lg:w-[45%]"
              } w-[90%] bg-white grid ${
                isReferral ? "grid-cols-2" : "grid-cols-3"
              } justify-center rounded-md shadow-lg items-center`}
            >
              {PopupData && (
                <Link
                  to={`/user_portal/pq_progress?type=${PopupData.policyType}&id=${PopupData.id}`}
                >
                  <div className="w-full group py-[30px] border-r-[1px] rounded-md cursor-pointer hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5">
                    <img
                      className="group-hover:animate-pulse w-16 h-16"
                      src={progicon}
                      alt="Quote Progress Icon"
                    />
                    <p className="font-bold text-[16px] text-center">
                      Quote Progress
                    </p>
                  </div>
                </Link>
              )}

              {PopupData && !isReferral && (
                <Link
                  to={`/user_portal/pq_results?type=${PopupData.policyType}&id=${PopupData.id}`}
                >
                  <div className="w-full border-r-[1px] group py-[30px] cursor-pointer rounded-md hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5">
                    <img
                      className="group-hover:animate-pulse w-16 h-16"
                      src={resicon}
                      alt="Quote Results Icon"
                    />
                    <p className="font-bold text-[16px] text-center">
                      Quote Results
                    </p>
                  </div>
                </Link>
              )}

              {PopupData && (
                <div
                  onClick={() => handleOpenDetailModal()}
                  className="w-full group py-[30px] rounded-md cursor-pointer hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5"
                >
                  <img
                    className="group-hover:animate-pulse w-16 h-16"
                    src={viewicon}
                    alt="View Submitted Details Icon"
                  />
                  <p className="font-bold text-[16px] text-center">
                    View Submitted Details
                  </p>
                </div>
              )}
            </div>
          </Slide>
        </Modal>

        {/* <Modal
          open={openDetailModal}
          onClose={handleCloseDetailModal}
          aria-labelledby="detail-modal-title"
          aria-describedby="detail-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="lg:w-[40%] w-[90%] bg-white p-5 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Submitted Details</h2>
            {selectedRowData ? (
              <div className="grid grid-cols-2 gap-4">
             
                <p>
                  <strong>Policy Type:</strong> {selectedRowData.policyType}
                </p>
                <p>
                  <strong>Policy ID:</strong> {selectedRowData.id}
                </p>
                <p>
                  <strong>Client Name:</strong> {selectedRowData.clientName}
                </p>
                <p>
                  <strong>Submission Date:</strong>{" "}
                  {selectedRowData.submissionDate}
                </p>
             
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </Modal> */}
        <PolicyDetailsModal
          open={openDetailModal}
          onClose={handleCloseDetailModal}
          selectedRow={selectedRowData}
        />

        <Modal
          open={isInspectionModalOpen}
          onClose={handleCloseInspectionModal}
          aria-labelledby="inspection-modal-title"
          aria-describedby="inspection-modal-description"
        >
          <Box
            className="w-[90%] md:w-[30%]"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleCloseInspectionModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id="inspection-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Upload Inspection for {selectedRow?.policyType}
            </Typography>

            {/* File Upload Section */}
            <div {...getRootProps()} style={{ cursor: "pointer" }}>
              <input {...getInputProps()} />
              <label
                htmlFor="uploadFile1"
                className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
              >
                {files.length === 0 ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-11 mb-2 fill-gray-500"
                      viewBox="0 0 32 32"
                    >
                      <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000"
                      />
                      <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000"
                      />
                    </svg>
                    Upload file
                    <p className="text-xs text-center px-2 font-medium text-gray-400 mt-2">
                      PNG, JPG, SVG, WEBP, and GIF are allowed.
                    </p>
                  </>
                ) : (
                  <div className="w-full flex flex-col justify-center items-center gap-2">
                    <img
                      className="w-[30%] animate-pulse"
                      src={tickicon}
                      alt="Tick Icon"
                    />
                    <p className="font-semibold text-center text-[12px]">
                      Files selected successfully...
                    </p>
                    <p className="font-light text-center text-[11px]">
                      Click outside to close modal...
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Display selected files */}
            {files.length > 0 && (
              <div className="mt-2 mb-2">
                <h2 className="mt-1 mb-1 italic font-semibold">
                  Selected Files:
                </h2>
                <ul className="w-full grid md:grid-cols-2 gap-1 justify-center items-center grid-cols-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center">
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
                            d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V6c0-.55-.45-1-1H5z"
                          />
                        </svg>
                      )}
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUploadInspection}
              disabled={files.length === 0 || loading} // Disable button if no files are selected or while loading
              className={`flex ml-auto mt-4 justify-center items-center px-4 py-2 rounded-md text-white 
                                        ${
                                          files.length === 0 || loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-700 hover:bg-blue-600"
                                        } 
                                        transition-colors duration-200 ease-in-out`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4.709z"
                    />
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Upload Inspection"
              )}
            </button>
          </Box>
        </Modal>

        <Modal
          open={openModalPolicy}
          onClose={onClosePolicy}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Slide
            direction="right"
            in={openModalPolicy}
            mountOnEnter
            unmountOnExit
            style={{ transition: "transform 2s ease-in-out" }}
          >
            <div className="lg:w-[30%] w-[90%] bg-white flex flex-col justify-center rounded-md shadow-lg items-center">
              {PopupDataPolicy && (
                <DropdownPolicy popup_data={PopupDataPolicy} />
              )}
            </div>
          </Slide>
        </Modal>
      </div>
    </>
  );
};

const DropdownPolicy = ({ popup_data }) => {
  // const years = [2018, 2019, 2020, 2021, 2022];
  // const premiumPrices1 = [100, 120, 130, 125, 140];
  // const premiumPrices2 = [90, 110, 125, 115, 130];
  const { currentUser } = useAuth();
  const [policyData, setPolicyData] = useState(null);
  const [prepData, setPrepData] = useState(null);
  const [changeData, setchangeData] = useState(null);
  const [viewModal, setviewModal] = useState(false);
  const [changeModal, setchangeModal] = useState(false);
  const [viewModalData, setviewModalData] = useState([]);
  const [changesAnswer, setchangesAnswer] = useState("");
  const [cancelModal, setcancelModal] = useState(false);
  const [cancelModalData, setcancelModalData] = useState(null);
  const [premiumHistoryModal, setpremiumHistoryModal] = useState(false);
  const [premiumHistoryModalData, setpremiumHistoryModalData] = useState(null);

  const viewPremiumHistoryModal = (data) => {
    setpremiumHistoryModal(true);
    setpremiumHistoryModalData(data);
  };

  const closePremiumHistoryModal = () => {
    setpremiumHistoryModal(false);
    setpremiumHistoryModalData(null);
  };

  const viewCancelModal = (data) => {
    setcancelModalData(data);
    setcancelModal(true);
  };

  const closecancelModal = () => {
    setcancelModalData(null);
    setcancelModal(false);
  };

  const changeCoverage = (data) => {
    setchangeModal(true);
    setchangeData(data);
  };

  const closechangeModal = () => {
    setchangeModal(false);
    setchangeData(null);
  };

  const viewCoverage = (data) => {
    setviewModal(true);
    setviewModalData({ ...data, ...popup_data });
  };

  const closeviewModal = () => {
    setviewModal(false);
    setviewModalData(null);
  };

  const getPolicyData = async () => {
    try {
      const collec = collection(db, "bound_policies");
      const snapshot = await getDocs(collec);
      const policiesData = snapshot.docs.map((doc) => ({
        policy_id: doc.id,
        ...doc.data(),
      }));
      const filteredPolicyData = policiesData.find(
        (policy) => policy.qid === popup_data.id
      );
      setPolicyData(filteredPolicyData);
    } catch (error) {
      console.error("Error fetching policy data:", error);
    }
  };

  const getPreparedQuoteData = async () => {
    try {
      const collec = collection(db, "prep_quotes");
      const snapshot = await getDocs(collec);
      const prepData = snapshot.docs.map((doc) => ({
        prep_quote_id: doc.id,
        ...doc.data(),
      }));
      const filteredPrepData = prepData.find(
        (prep) => prep.q_id === popup_data.id
      );
      setPrepData(filteredPrepData.tablesData.table_1);
    } catch (error) {
      console.error("Error fetching prepared quote data:", error);
    }
  };

  useEffect(() => {
    getPolicyData();
    getPreparedQuoteData();
  }, [popup_data.id]);

  const [showChangeCoverageOptions, setShowChangeCoverageOptions] =
    useState(false);

  const handleToggleChangeCoverageOptions = () => {
    setShowChangeCoverageOptions(!showChangeCoverageOptions);
  };

  const handlechangePolicy = async () => {
    try {
      const data = { ...changeData, changesAnswer };
      await addDoc(collection(db, "policy_changes"), data);
      ClientQuotePolicyChangeMail(
        currentUser.data?.name,
        currentUser.data?.email,
        changeData.qsr_type
      );
      closechangeModal();
      closeviewModal();
      toast.success("Changes submitted!");
    } catch (error) {
      console.log("Error changing policy!");
      toast.error("Error submitting changes!");
    }
  };

  const handlecancelPolicy = async () => {
    try {
      const data = { ...cancelModalData, type: "cancel" };
      await addDoc(collection(db, "cancel_policies"), data);
      ClientQuotePolicyCancelMail(
        currentUser.data?.name,
        currentUser.data?.email,
        cancelModalData.qsr_type
      );
      closecancelModal();
      closeviewModal();
      toast.success("Cancel request submitted!");
    } catch (error) {
      console.log("Error cancelling policy!");
      toast.error("Error cancelling changes!");
    }
  };

  return (
    <>
      <div className="w-full flex-col justify-center items-center rounded-md">
        <ToastContainer />
        <div className="w-full flex flex-col justify-center rounded-t-md items-center py-4 bg-[#003049] text-white">
          <p className="text-center font-semibold text-[24px]">
            Select your action
          </p>
        </div>
        <div className="divide-y divide-solid">
          <div
            onClick={() => viewCoverage(policyData)}
            className="w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4"
          >
            <p className="text-[17px] font-semibold">View Coverage</p>
            <img className="w-[24px] h-[24px]" src={img1} alt="" />
          </div>

          <div
            className="w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4"
            onClick={handleToggleChangeCoverageOptions}
          >
            {showChangeCoverageOptions && (
              <div className="checkbox-wrapper-56">
                <label className="container">
                  <input defaultChecked type="checkbox" />
                  <div className="checkmark"></div>
                </label>
              </div>
            )}
            <p className="text-[17px] font-semibold">Change Coverage</p>
            <img className="w-[24px] h-[24px]" src={img2} alt="" />
          </div>

          <div
            onClick={() => viewPremiumHistoryModal(policyData)}
            className="w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4"
          >
            <p className="text-[17px] font-semibold">Premium History</p>
            <img className="w-[24px] h-[24px]" src={img3} alt="" />
          </div>

          <div
            onClick={() => viewCancelModal(policyData)}
            className="w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4"
          >
            <p className="text-[17px] font-semibold">Cancel Policy</p>
            <img className="w-[24px] h-[24px]" src={img4} alt="" />
          </div>

          {showChangeCoverageOptions && (
            <>
              <div
                onClick={() => changeCoverage(policyData)}
                className="w-full flex cursor-pointer bg-[#17A600] hover:bg-[#559e4a] flex-row gap-2 justify-center text-white items-center py-4"
              >
                <p className="text-[17px] font-semibold">Confirm</p>
                <ArrowForwardIcon />
              </div>
            </>
          )}
        </div>

        {viewModalData && (
          <Modal
            open={viewModal}
            onClose={closeviewModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Slide
              direction="right"
              in={viewModal}
              mountOnEnter
              unmountOnExit
              style={{ transition: "transform 2s ease-in-out" }}
            >
              <div className="w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md gap-y-10">
                <div className="w-full flex flex-col justify-center items-start">
                  {viewModalData.company_name && (
                    <p>
                      <span className="font-medium">Company Name: </span>
                      {viewModalData.company_name || "Name of the company"}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Effective Dates: </span>
                    {`${viewModalData.bound_date} - ${viewModalData.effective_date}` ||
                      "Dates From - To"}
                  </p>
                  <p>
                    <span className="font-medium">Policy Number: </span>
                    {viewModalData.policy_id || "Policy Id"}
                  </p>
                  <p>
                    <span className="font-medium">Policy Type: </span>
                    {viewModalData.qsr_type || "Policy Type"}
                  </p>
                </div>
                <div className="w-full flex flex-col justify-center items-start">
                  {viewModalData.persons &&
                    viewModalData.persons?.map((person, index) => (
                      <p key={index}>
                        <span className="font-medium">Name Insured: </span>
                        {person.name || "Name of the Insured Person"}
                      </p>
                    ))}
                </div>
                <div className="w-full flex flex-col justify-center items-start">
                  <p>
                    <span className="font-medium">Property Insured: </span>
                    {viewModalData.address
                      ? viewModalData.address
                      : viewModalData.garaging_address || "Name of the company"}
                  </p>
                </div>

                {prepData && (
                  <div className="w-full flex flex-col justify-center items-start">
                    <p className="font-medium">Coverage: </p>
                    <div className="w-full flex flex-col justify-center items-start">
                      {prepData?.map((item, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col text-[16px] font-normal justify-start items-start gap-1"
                        >
                          {Object.keys(item).map(
                            (key) =>
                              key !== "id" && (
                                <p key={key}>
                                  <span className="font-medium">{key}: </span>
                                  {item[key]}
                                </p>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewModalData && (
                  <Modal
                    open={viewModal}
                    onClose={closeviewModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Slide
                      direction="right"
                      in={viewModal}
                      mountOnEnter
                      unmountOnExit
                      style={{ transition: "transform 2s ease-in-out" }}
                    >
                      <div className="w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md gap-y-10">
                        {/* {prepData && (<div className='w-full flex flex-col justify-center items-start'>
                                    <p className='font-medium'>Coverage: </p>
                                    <div className='w-full flex flex-col justify-center items-start'>
                                        {prepData?.map((item, index) => (
                                            <div key={index} className='w-full flex flex-col text-[16px] font-normal justify-start items-start gap-1'>
                                                {Object.keys(item).map((key) => (
                                                    key !== 'id' &&
                                                    <p key={key}>
                                                        <span className='font-medium'>{key}: </span>
                                                        {item[key]}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>)}
                                */}

                        {viewModalData.policyData && (
                          <div className="w-full flex flex-col items-center">
                            {/* Top Centered Image */}
                            <img
                              src={newlogo}
                              alt="Policy Image"
                              className="w-full object-cover mb-6"
                            />

                            {/* Policy Details */}
                            <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-lg">
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Property Insured:{" "}
                                </span>
                                {viewModalData.address
                                  ? viewModalData.address
                                  : viewModalData.garaging_address ||
                                    "Name of the company"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Name of Insured:{" "}
                                </span>
                                {viewModalData.policyData?.named_insured ||
                                  "Name of Insured"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Premium Amount:{" "}
                                </span>
                                {viewModalData.policyData?.policy_premium ||
                                  "Premium Amount"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">Carrier: </span>
                                {viewModalData.policyData?.carrier || "Carrier"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Bind Date:{" "}
                                </span>
                                {viewModalData.policyData?.bind_date ||
                                  "Bind Date"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Contact Id:{" "}
                                </span>
                                {viewModalData.policyData?.ContactId ||
                                  "Contact Id"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Contact Address:{" "}
                                </span>
                                {viewModalData.policyData?.ContactAddress ||
                                  "Contact Address"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Policy Id:{" "}
                                </span>
                                {viewModalData.policyData?.PolicyId ||
                                  "Policy Id"}
                              </p>
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  Effective Date:{" "}
                                </span>
                                {viewModalData.policyData?.effective_date ||
                                  "Effective Date"}
                              </p>
                              <p className="text-md md:text-lg font-medium">
                                <span className="font-semibold">
                                  Expiry Date:{" "}
                                </span>
                                {viewModalData.policyData?.exp_date ||
                                  "Expiry Date"}
                              </p>
                            </div>
                          </div>
                        )}
                        {!viewModalData.policyData && (
                          <div className="w-full flex flex-col items-center">
                            <img
                              src={newlogo}
                              alt="Policy Image"
                              className="w-full object-cover mb-6"
                            />
                            <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-lg">
                              <p className="text-md md:text-lg font-medium mb-2">
                                <span className="font-semibold">
                                  No Policy Data Available.
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Slide>
                  </Modal>
                )}

                {premiumHistoryModalData && (
                  <Modal
                    open={premiumHistoryModal}
                    onClose={closePremiumHistoryModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Slide
                      direction="right"
                      in={premiumHistoryModal}
                      mountOnEnter
                      unmountOnExit
                      style={{ transition: "transform 2s ease-in-out" }}
                    >
                      <div className="w-[95%] overflow-y-auto max-h-[90vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md gap-y-10">
                        <LineGraph
                        // years={years}
                        // premiumPrices1={premiumPrices1}
                        // premiumPrices2={premiumPrices2}
                        />
                      </div>
                    </Slide>
                  </Modal>
                )}
              </div>
            </Slide>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ViewPolicyQuote;
