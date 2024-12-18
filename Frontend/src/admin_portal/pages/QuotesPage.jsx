import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Box } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import papericon from "../../assets/dash/quotes/paper.png";
import boxicon from "../../assets/dash/quotes/box.png";
import tickicon from "../../assets/dash/quotes/tick.png";
import peopleicon from "../../assets/dash/quotes/people.png";
import historyicon from "../../assets/dash/quotes/history.png";
import { MaterialReactTable } from "material-react-table";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../db";
import HomePolicyPreview from "./QuotePoliciesPreviews/HomePolicyPreview";
import AutoPolicyPreview from "./QuotePoliciesPreviews/AutoPolicyPreview";
import LiabilityPolicyPreview from "./QuotePoliciesPreviews/LiabilityPolicyPreview";
import FloodPolicyPreview from "./QuotePoliciesPreviews/FloodPolicyPreview";
import { Link } from "react-router-dom";
import DeliveredQuotePreviewAdmin from "../components/DeliveredQuotePreviewAdmin";
import BinderReqPreview from "../components/BinderReqPreview";
import { getCurrentDate, getType } from "../../utils/helperSnippets";
import {
  AdminBindConfirmQuoteMail,
  AdminSendReminder,
} from "../../utils/mailingFuncs";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";

const QuotesPage = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [openModal, setopenModal] = useState(false);
  const [popupValue, setPopupvalue] = useState(null);

  const [BinderPopValue, setBinderPopValue] = useState(null);
  const [slideModal, setSlideModal] = useState(false);
  const slideModalClose = () => {
    setSlideModal(false);
    setBinderPopValue(null);
  };
  const slideModalOpen = (data) => {
    setSlideModal(true);
    setBinderPopValue(data);
  };

  const handleModal = (data) => {
    setopenModal(true);
    setPopupvalue(data);
  };

  const handleModalClose = () => {
    setopenModal(false);
    setPopupvalue(null);
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const [req_quotes, setReqQuotes] = useState([]);
  const [del_quotes, setDelQuotes] = useState([]);
  const [binder_req_quotes, setBinderReqQuotes] = useState([]);
  const [policy_bound_data, setpolicy_bound_data] = useState([]);
  const [policy_history_data, setpolicy_history] = useState([]);
  const [selectedPolicyData, setSelectedPolicyData] = useState(null);
  const [selectedPolicyType, setSelectedPolicyType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPolicy = (policyData, policyType) => {
    switch (policyType) {
      case "Home":
        setSelectedPolicyData(policyData);
        setSelectedPolicyType("Home");
        setIsModalOpen(true);
        break;
      case "Auto":
        setSelectedPolicyData(policyData);
        setSelectedPolicyType("Auto");
        setIsModalOpen(true);
        break;
      case "Liability":
        setSelectedPolicyData(policyData);
        setSelectedPolicyType("Liability");
        setIsModalOpen(true);
        break;
      case "Flood":
        setSelectedPolicyData(policyData);
        setSelectedPolicyType("Flood");
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getAllReqQuoteTypes = async () => {
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

      const allQuotes = [
        ...homeQuotesData,
        ...autoQuotesData,
        ...liabilityQuotesData,
        ...floodQuotesData,
      ];
      let allReqQuotes = [];
      allQuotes &&
        allQuotes.forEach((quote) => {
          if (quote.status_step === "1") {
            allReqQuotes.push(quote);
          }
        });
      setReqQuotes(allReqQuotes);
    } catch (error) {
      toast.error("Error Fetching Requested Quotes!");
    }
  };
  const getAllDeliveredQuotes = async () => {
    try {
      const DeliveredQuotesCollection = collection(db, "prep_quotes");
      const dqsnapshot = await getDocs(DeliveredQuotesCollection);
      const DeliveredQuotesData = dqsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDelQuotes(DeliveredQuotesData);
    } catch (error) {
      toast.error("Error Fetching Delivered Quotes!");
    }
  };
  const getAllBinderRequestedQuotes = async () => {
    try {
      const BinderReqCollection = collection(db, "bind_req_quotes");
      const brsnapshot = await getDocs(BinderReqCollection);
      const BinderReqQuotesData = brsnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((data) => data.bound_status === "pending");
      setBinderReqQuotes(BinderReqQuotesData);
    } catch (error) {
      toast.error("Error Fetching Binder Requested Quotes!");
    }
  };
  const getAllPolicyBoundData = async () => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const PBCollection = collection(db, "bound_policies");
      const pbsnapshot = await getDocs(PBCollection);
      const data = pbsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const PBData =
        data &&
        data.filter((item) => {
          const effectiveDate = new Date(item.effective_date);
          effectiveDate.setHours(0, 0, 0, 0);
          return effectiveDate >= currentDate;
        });

      const historyData =
        data &&
        data?.filter((item) => {
          const effectiveDate = new Date(item.effective_date);
          return effectiveDate < currentDate;
        });

      setpolicy_bound_data(PBData);
      setpolicy_history(historyData);
    } catch (error) {
      toast.error("Error Fetching Policy Bound Data!");
    }
  };

  useEffect(() => {
    getAllPolicyBoundData();
    getAllBinderRequestedQuotes();
    getAllDeliveredQuotes();
    getAllReqQuoteTypes();
  }, []);

  const [reminderLoader, setReminderLoader] = useState({});

  const sendReminder = async (req_qid, policyType, user) => {
    try {
      setReminderLoader((prevState) => ({ ...prevState, [req_qid]: true }));
      const docRef = await addDoc(collection(db, "reminders"), {
        req_qid,
        policyType,
        user,
        reminderCreatedAt: new Date().toISOString(),
        fulfilled: false,
      });
      AdminSendReminder(user.name, user.email, policyType);
      if (docRef.id) {
        toast.success("Reminder sent!");
        getAllReqQuoteTypes();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReminderLoader((prevState) => ({ ...prevState, [req_qid]: false }));
    }
  };

  const req_columns = useMemo(
    () => [
      {
        accessorKey: "inuser.name",
        header: "Client",
        size: 100,
        Cell: ({ row }) => {
          const isReferral = row?.original?.user?.signupType === "Referral";
          console.log("row", row);
          return (
            <Box display="flex" alignItems="center">
              <span>
                {row?.original?.inuser?.name?.length > 100
                  ? row?.original?.inuser?.name.slice(0, 100) + "..."
                  : row?.original?.inuser?.name}
              </span>

              {isReferral && (
                <span
                  style={{
                    backgroundColor: "#003049", // Customize color here
                    color: "#fff",
                    padding: "2px 6px",
                    fontSize: "10px",
                    borderRadius: "12px",
                    marginLeft: "8px",
                    fontWeight: "bold",
                  }}
                >
                  R
                </span>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "inuser.phoneNumber",
        header: "Client Contact no.",
        size: 200,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue()?.length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "inuser.email",
        header: "Client Email",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue()?.length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "policyType",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue()?.length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="5px"
          >
            {cell.getValue() === "pending" ? (
              <>
                <div className="h-[5px] w-[5px] bg-[#ff0000] rounded-full"></div>
                <p className="text-center text-[12px]">Pending</p>
              </>
            ) : (
              <>
                <div className="h-[5px] w-[5px] bg-[#00C32B] rounded-full"></div>
                <p className="text-center text-[12px]">Completed</p>
              </>
            )}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => {
                handleViewPolicy(
                  cell.row.original,
                  cell.row.original.policyType
                );
              }}
              className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
            >
              View Form Details
            </button>

            <Link
              to={`/admin_portal/editor?qsr_type=${cell.row.original.policyType}&q_id=${cell.row.original.id}&qu_id=${cell.row.original.user.id}`}
              target="_blank"
            >
              <button
                disabled={cell.row.original.status === "pending" ? true : false}
                className={`${
                  cell.row.original.status === "pending"
                    ? "bg-[#ADADAD]"
                    : "bg-[#F77F00]"
                } font-bold rounded-[18px] px-[16px] py-[4px] text-white text-[10px]`}
              >
                Send Quote
              </button>
            </Link>

            <button
              onClick={() =>
                sendReminder(
                  cell.row.original.id,
                  cell.row.original.policyType,
                  cell.row.original.user
                )
              }
              disabled={
                reminderLoader[cell.row.original.id] ||
                cell.row.original.status !== "pending"
              }
              className={`${
                cell.row.original.status === "pending"
                  ? "bg-[#175ae1]"
                  : "bg-[#ADADAD]"
              } font-bold rounded-[18px] px-[16px] py-[4px] text-white text-[10px] flex gap-1 items-center justify-center`}
            >
              {reminderLoader[cell.row.original.id] ? (
                <>
                  <span>Sending</span>
                  <CircularProgress size={20} color="inherit" />
                </>
              ) : (
                "Send Reminder"
              )}
            </button>
          </Box>
        ),
      },
    ],
    [reminderLoader]
  );

  const del_columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Client",
        size: 100,
        Cell: ({ cell, row }) => {
          const { persons, drivers } = row.original;
          const name =
            (persons && persons.length > 0 && persons[0].name) ||
            (drivers && drivers.length > 0 && drivers[0].name) ||
            cell.getValue();
          return (
            <Box>{name.length > 100 ? name.slice(0, 100) + "..." : name}</Box>
          );
        },
      },
      {
        accessorKey: "user.phoneNumber",
        header: "Client Contact no.",
        size: 200,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.email",
        header: "Client Email",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => handleModal(cell.row.original)}
              className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
            >
              View Quote
            </button>
          </Box>
        ),
      },
    ],
    []
  );

  const [boundLoader, setBoundLoader] = useState({});

  const GetPolicyDataFromClientDynamics = async (email) => {
    try {
      const resp = await axiosInstance.post("/contact_info", {
        email,
      });
      if (resp.data.status === 200) {
        const ContactId = resp.data?.ContactId;
        const ContactAddress = resp.data?.address;

        const policyResp = await axiosInstance.post("/policy_info", {
          ContactId,
        });
        if (policyResp.data.status === 200) {
          const PolicyData = {
            ...policyResp.data.policyData[0],
            ContactAddress: ContactAddress,
          };
          return PolicyData;
        } else {
          toast.error(
            `Client Dynamics Error: No Policy Data found for ContactId: ${ContactId}`
          );
          return null;
        }
      } else {
        toast.error(
          `Client Dynamics Error: No ContactId found for email: ${email}`
        );
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBoundPolicy = async (data, rowdocid) => {
    try {
      setBoundLoader((prevState) => ({ ...prevState, [data.id]: true }));
      const policyData = await GetPolicyDataFromClientDynamics(
        data.user?.email
      );
      if (policyData !== null) {
        await addDoc(collection(db, "bound_policies"), {
          ...data,
          policyData,
          bound_status: "bounded",
          bound_date: getCurrentDate("dash"),
        }); // add new record
        await updateStatusStep(data.qsr_type, data.qid);
        await updateBoundStatus(rowdocid);
        AdminBindConfirmQuoteMail(
          data.user?.name,
          data.user?.email,
          data.qsr_type
        );
        toast.success("Policy bounded successfully!");
      } else {
        return;
      }
      getAllBinderRequestedQuotes();
    } catch (error) {
      toast.error("Error bounding policy!");
      console.log(error);
    } finally {
      setBoundLoader((prevState) => ({ ...prevState, [data.id]: false }));
    }
  };

  const updateBoundStatus = async (id) => {
    try {
      let docdata = {};
      const docRef = doc(db, "bind_req_quotes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        docdata = { ...docSnap.data(), id: docSnap.id };
      }
      await updateDoc(docRef, {
        bound_status: "bounded",
      });
    } catch (error) {
      toast.error("Error updating bound_status in bind_req_quotes!");
      console.log(error);
    }
  };

  const updateStatusStep = async (type, id) => {
    try {
      let docdata = {};
      const collectionRef = getType(type);
      const docRef = doc(db, collectionRef, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        docdata = { ...docSnap.data(), id: docSnap.id };
      }
      await updateDoc(docRef, {
        status_step: "4",
      });
    } catch (error) {
      toast.error("Error updating status!");
      console.log(error);
    }
  };

  const binder_req_columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Client",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.phoneNumber",
        header: "Client Contact no.",
        size: 200,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.email",
        header: "Client Email",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => slideModalOpen(cell.row.original)}
              className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
            >
              View Binder
            </button>
            <button
              disabled={boundLoader[cell.row.original.id]}
              onClick={() =>
                handleBoundPolicy(cell.row.original, cell.row.original.id)
              }
              className="bg-[#17A600] rounded-[18px] flex flex-row justify-center items-center gap-1 px-[16px] py-[4px] text-white text-[10px]"
            >
              {boundLoader[cell.row.original.id] ? (
                <>
                  <span>Binding</span>
                  <CircularProgress size={20} color="inherit" />
                </>
              ) : (
                "Bind Policy"
              )}
            </button>
          </Box>
        ),
      },
    ],
    [boundLoader]
  );

  const policy_bound_columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Client",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.phoneNumber",
        header: "Client Contact no.",
        size: 200,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.email",
        header: "Client Email",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => slideModalOpen(cell.row.original)}
              className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
            >
              View Policy
            </button>
          </Box>
        ),
      },
    ],
    []
  );

  const [deleteExpiredLoader, setdeleteExpiredLoader] = useState({});

  const deleteExpiredPolicy = async (id) => {
    try {
      setdeleteExpiredLoader((prevState) => ({ ...prevState, [id]: true }));
      const policiesCollectionRef = collection(db, "bound_policies");
      const q = query(policiesCollectionRef, where("id", "==", id));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const policyDocRef = doc.ref;
        await deleteDoc(policyDocRef);
        toast.success(`Expired Policy deleted successfully.`);
        getAllPolicyBoundData();
      });
    } catch (error) {
      console.error("Error deleting documents: ", error);
    } finally {
      setdeleteExpiredLoader((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  const policy_history_columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Client",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.phoneNumber",
        header: "Client Contact no.",
        size: 200,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "user.email",
        header: "Client Email",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "..."
              : cell.getValue()}
          </Box>
        ),
      },
      {
        header: "Effective Dates",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {`B: ${cell.row.original.bound_date} - E: ${cell.row.original.effective_date}`}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => slideModalOpen(cell.row.original)}
              className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
            >
              View Policy
            </button>
            <button
              onClick={() => deleteExpiredPolicy(cell.row.original.id)}
              disabled={deleteExpiredLoader[cell.row.original.id]}
              className="bg-[#db1e1e] rounded-[18px] flex flex-row justify-center items-center gap-1 px-[16px] py-[4px] text-white text-[10px]"
            >
              {deleteExpiredLoader[cell.row.original.id] ? (
                <>
                  <span>Deleting</span>
                  <CircularProgress size={20} color="inherit" />
                </>
              ) : (
                "Delete Policy"
              )}
            </button>
          </Box>
        ),
      },
    ],
    [deleteExpiredLoader]
  );

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <ToastContainer />

        <div className="w-[90%] grid md:grid-cols-2 gap-5 grid-cols-1 lg:grid-cols-3 justify-center items-center">
          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedButton === "requestedQuotes"
                ? "bg-[#003049] text-white"
                : ""
            }`}
            onClick={() => handleButtonClick("requestedQuotes")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Requested Quotes
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                You have {req_quotes && req_quotes.length} Quotes Requested
              </p>
            </div>
            <img src={papericon} alt="" />
          </div>

          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedButton === "deliveredQuotes"
                ? "bg-[#003049] text-white"
                : ""
            }`}
            onClick={() => handleButtonClick("deliveredQuotes")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Delivered Quotes
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                {del_quotes && del_quotes.length} Quotes have been successfully
                Delivered
              </p>
            </div>
            <img src={boxicon} alt="" />
          </div>

          <div
            className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedButton === "binderRequested"
                ? "bg-[#003049] text-white"
                : ""
            }`}
            onClick={() => handleButtonClick("binderRequested")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Binder Requested
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                {binder_req_quotes && binder_req_quotes.length} Binder have been
                requested
              </p>
            </div>
            <img src={tickicon} alt="" />
          </div>
        </div>

        <div className="w-[90%] flex flex-col lg:flex-row gap-5 mt-[30px] justify-center items-center">
          <div
            className={`group w-full lg:w-[33%] hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedButton === "policyBound" ? "bg-[#003049] text-white" : ""
            }`}
            onClick={() => handleButtonClick("policyBound")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Policy Bound
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                {policy_bound_data && policy_bound_data.length} policies have
                been bound
              </p>
            </div>
            <img src={peopleicon} alt="" />
          </div>

          <div
            className={`group w-full lg:w-[33%] hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${
              selectedButton === "policyHistory"
                ? "bg-[#003049] text-white"
                : ""
            }`}
            onClick={() => handleButtonClick("policyHistory")}
          >
            <div className="flex w-[60%] flex-col justify-center items-center lg:items-start gap-1">
              <p className="lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white">
                Policy History
              </p>
              <p className="lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white">
                {policy_history_data && policy_history_data.length} Policies
                have been expired
              </p>
            </div>
            <img src={historyicon} alt="" />
          </div>
        </div>
        {console.log("request", req_quotes)}

        {selectedButton === "requestedQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {req_quotes && req_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable columns={req_columns} data={req_quotes} />
              </div>
            ) : (
              <p className="text-center mt-5">No Quotes Found....</p>
            )}
          </div>
        )}

        {selectedButton === "deliveredQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {del_quotes && del_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable columns={del_columns} data={del_quotes} />
              </div>
            ) : (
              <p className="text-center mt-5">No Quotes Found....</p>
            )}

            <DeliveredQuotePreviewAdmin
              data={popupValue}
              openModal={openModal}
              onClose={handleModalClose}
            />
          </div>
        )}

        {selectedButton === "binderRequested" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {binder_req_quotes && binder_req_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={binder_req_columns}
                  data={binder_req_quotes}
                />
              </div>
            ) : (
              <p className="text-center mt-5">No Quotes Found....</p>
            )}

            <BinderReqPreview
              data={BinderPopValue}
              isSlideModalOpen={slideModal}
              onClose={slideModalClose}
            />
          </div>
        )}

        {selectedButton === "policyBound" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {policy_bound_data && policy_bound_data.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={policy_bound_columns}
                  data={policy_bound_data}
                />
              </div>
            ) : (
              <p className="text-center mt-5">No Policy Bound Found....</p>
            )}

            <BinderReqPreview
              data={BinderPopValue}
              isSlideModalOpen={slideModal}
              onClose={slideModalClose}
            />
          </div>
        )}

        {selectedButton === "policyHistory" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {policy_history_data && policy_history_data.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={policy_history_columns}
                  data={policy_history_data}
                />
              </div>
            ) : (
              <p className="text-center mt-5">No Policy Bound Found....</p>
            )}

            <BinderReqPreview
              data={BinderPopValue}
              isSlideModalOpen={slideModal}
              onClose={slideModalClose}
            />
          </div>
        )}

        {selectedPolicyType === "Home" && (
          <HomePolicyPreview
            data={selectedPolicyData}
            open={isModalOpen}
            handleClose={handleCloseModal}
          />
        )}
        {selectedPolicyType === "Auto" && (
          <AutoPolicyPreview
            data={selectedPolicyData}
            open={isModalOpen}
            handleClose={handleCloseModal}
          />
        )}
        {selectedPolicyType === "Liability" && (
          <LiabilityPolicyPreview
            data={selectedPolicyData}
            open={isModalOpen}
            handleClose={handleCloseModal}
          />
        )}
        {selectedPolicyType === "Flood" && (
          <FloodPolicyPreview
            data={selectedPolicyData}
            open={isModalOpen}
            handleClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

export default QuotesPage;
