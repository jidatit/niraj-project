import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  orderBy,
  serverTimestamp,
  getCountFromServer,
  limit,
  startAfter,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../db";
import HomePolicyPreview from "./QuotePoliciesPreviews/HomePolicyPreview";
import AutoPolicyPreview from "./QuotePoliciesPreviews/AutoPolicyPreview";
import LiabilityPolicyPreview from "./QuotePoliciesPreviews/LiabilityPolicyPreview";
import FloodPolicyPreview from "./QuotePoliciesPreviews/FloodPolicyPreview";
import { Link, useNavigate } from "react-router-dom";
import DeliveredQuotePreviewAdmin from "../components/DeliveredQuotePreviewAdmin";
import BinderReqPreview from "../components/BinderReqPreview";
import {
  formatDate,
  getCurrentDate,
  getType,
} from "../../utils/helperSnippets";
import {
  AdminBindConfirmQuoteMail,
  AdminSendReminder,
} from "../../utils/mailingFuncs";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";
import PolicyCreationModal from "../components/PolicyCreateModal";
import AdminUserSelectDialog from "../components/AdminUserSelectDialog";
import EmptyState from "../../components/EmptyState";
import { AttachReferralModal } from "../components/AttachReferral";
import { useQuotesStore } from "../../utils/quotesStore";
import { batchGetReferralMetaByEmails } from "../../utils/userUtils";

const QuotesPage = () => {
  const {
    quotes: preAssignQuotes,
    loading: quotesLoading,
    fetchQuotes,
  } = useQuotesStore();


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
  const [openBindModal, setOpenBindModal] = useState(false);

  const handleBindModal = (data) => {
    setOpenBindModal(true);
    setPopupvalue(data);
  };

  const handleBindModalClose = () => {
    setOpenBindModal(false);
    setPopupvalue(null);
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
  //this is for the pre rennewal quotes
  const [preRenewalQuotes, setPreRenewalQuotes] = useState([]);
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

      const [hqsnapshot, aqsnapshot, lqsnapshot, fqsnapshot] =
        await Promise.all([
          getDocs(homeQuotesCollection),
          getDocs(autoQuotesCollection),
          getDocs(liabilityQuotesCollection),
          getDocs(floodQuotesCollection),
        ]);

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


      // Helper to extract email per quote type
      const getEmail = (quote, policyType) => {
        const type = policyType?.toLowerCase();
        if (type === "home" || type === "flood" || type === "liability") {
          return quote?.inuser?.email?.toLowerCase() || quote?.email?.toLowerCase();
        }
        if (type === "auto") {
          return quote?.user?.email?.toLowerCase() || quote?.email?.toLowerCase();
        }
        return quote?.email?.toLowerCase(); // Fallback
      };

      // Collect unique emails
      const emails = [
        ...new Set(
          allQuotes
            .map((quote) => getEmail(quote, quote.policyType))
            .filter(Boolean)
        ),
      ];

      // Batch fetch referral meta
      const referralMap = await batchGetReferralMetaByEmails(emails);

      // Enrich quotes
      const enrichedQuotes = allQuotes.map((quote) => {
        const email = getEmail(quote, quote.policyType);
        return { ...quote, referralInfo: referralMap[email] || {} };
      });

      // Split into pre-renewal and non-pre-renewal (use enriched)
      const reqQuotes = [];
      const preRenewalQuotes = [];
      enrichedQuotes.forEach((quote) => {
        if (quote.status_step === "1") {
          if (quote?.PreRenwalQuote === true) { // Typo? Assume PreRenewalQuote
            preRenewalQuotes.push(quote);
          } else {
            reqQuotes.push(quote);
          }
        }
      });

      const sortByCreatedAtDesc = (a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
      };

      setReqQuotes(reqQuotes.sort(sortByCreatedAtDesc));
      setPreRenewalQuotes(preRenewalQuotes.sort(sortByCreatedAtDesc));
    } catch (error) {
      toast.error("Error Fetching Requested Quotes!");
      console.error("getAllReqQuoteTypes error:", error);
    }
  };

  const getAllDeliveredQuotes = async () => {
    try {
      const DeliveredQuotesCollection = collection(db, "prep_quotes");
      const dqsnapshot = await getDocs(DeliveredQuotesCollection);
      const DeliveredQuotesData = dqsnapshot.docs.map((doc) => {
        const data = doc.data();
        const dateParts = data.date?.split("/");

        // Parse the date into a Date object
        const parsedDate = dateParts
          ? new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
          : null;

        return {
          id: doc.id,
          ...data,
          parsedDate,
        };
      });

      DeliveredQuotesData.sort((a, b) => {
        if (a.parsedDate && b.parsedDate) {
          return b.parsedDate - a.parsedDate; // Sort latest first
        }
        return 0;
      });

      setDelQuotes(DeliveredQuotesData);
    } catch (error) {
      toast.error("Error Fetching Delivered Quotes!");
    }
  };

  const getAllBinderRequestedQuotes = async () => {
    try {
      const BinderReqCollection = collection(db, "bind_req_quotes");
      const brsnapshot = await getDocs(BinderReqCollection);

      // Get all quotes data
      const allQuotes = brsnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((data) => data.bound_status === "pending");

      // Sort by createdAt, latest first, fallback to 0 if missing
      const sortedQuotes = allQuotes.sort((a, b) => {
        const dateA =
          a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0; // Use createdAt if updatedAt is missing
        const dateB =
          b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;

        // Sort by the most recent date
        return dateB - dateA;
      });

      // Set sorted quotes to the state
      setBinderReqQuotes(sortedQuotes);
    } catch (error) {
      toast.error("Error Fetching Binder Requested Quotes!");
      console.error(error);
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

      const PBData = data?.filter((item) => {
        const exp_date = new Date(item?.exp_date);
        exp_date.setHours(0, 0, 0, 0);
        return exp_date >= currentDate;
      });

      const historyData = data?.filter((item) => {
        const exp_date = new Date(item?.exp_date);
        return exp_date < currentDate;
      });

      const sortedPBData = PBData.sort((a, b) => {
        const dateA =
          a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0; // Use createdAt if updatedAt is missing
        const dateB =
          b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;

        // Sort by the most recent date
        return dateB - dateA;
      });
      const sortedhistoryData = historyData.sort((a, b) => {
        const dateA =
          a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0; // Use createdAt if updatedAt is missing
        const dateB =
          b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;

        // Sort by the most recent date
        return dateB - dateA;
      });
      setpolicy_bound_data(sortedPBData);
      setpolicy_history(sortedhistoryData);
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const handleDeleteQuoteClick = (quote) => {
    setSelectedQuote(quote);
    setOpenDeleteDialog(true);
  };

  const handleDeleteQuote = async () => {
    if (!selectedQuote) return;

    setDeleteLoading(true);
    try {
      // Convert policyType to lowercase
      const policyType = selectedQuote.policyType.toLowerCase();
      const quoteRef = doc(db, `${policyType}_quotes`, selectedQuote.id);

      await deleteDoc(quoteRef);
      toast.success("Quote deleted successfully.");
      setOpenDeleteDialog(false);
      getAllReqQuoteTypes();
    } catch (error) {
      console.error("Error deleting quote:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const req_columns = useMemo(
    () => [
      {
        accessorKey: "inuser.name",
        header: "Client",
        size: 100,
        Cell: ({ row }) => {
          const { policyType, inuser, drivers } = row?.original || {};

          const name =
            policyType === "Auto" &&
              Array.isArray(drivers) &&
              drivers.length > 0 &&
              drivers[0]?.name
              ? drivers[0]?.name
              : inuser?.name;

          return (
            <Box display="flex" alignItems="center">
              <Tooltip title={name || "N/A"} arrow>
                <span>
                  {name?.length > 15
                    ? name.slice(0, 15) + "..."
                    : name || "N/A"}
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
      // {
      //   accessorKey: "referral",
      //   header: "Referral",
      //   size: 200,
      //   Cell: ({ row }) => {
      //     const isReferral = row?.original?.user?.signupType === "Referral";
      //     return (
      //       <Box>
      //         {isReferral ? row?.original?.user?.name || "N/A" : "None"}
      //       </Box>
      //     );
      //   },
      // },
      // {
      //   accessorKey: "referral",
      //   header: "Referral",
      //   size: 200,
      //   Cell: ({ row }) => {
      //     const user = row?.original?.user;
      //     if (!user) return <Box>None</Box>;

      //     const isReferralSignup = user.signupType === "Referral";
      //     const isClientWithReferral =
      //       user.signupType === "Client" && (user.hasReferral || user.byReferral);

      //     const referralName = isReferralSignup
      //       ? user.name || "N/A"
      //       : isClientWithReferral
      //         ? user.referralData?.name || "N/A"
      //         : "None";

      //     return <Box>{referralName}</Box>;
      //   },
      // },

      {
        accessorKey: "referral",
        header: "Referral",
        size: 200,
        Cell: ({ row }) => {
          const referralInfo = row?.original?.referralInfo || {};
          return <Box>{referralInfo.name || "No Referral	"}</Box>;
        },
      },

      {
        accessorKey: "inuser.email",
        header: "Client Email",
        size: 100,
        Cell: ({ row }) => {
          const { policyType, inuser, drivers } = row?.original || {};

          // Choose the email based on policy type (use email from inuser or drivers)
          const email =
            policyType === "Auto" &&
              Array.isArray(drivers) &&
              drivers.length > 0
              ? drivers[0]?.email
              : inuser?.email;

          return (
            <Box>
              {email?.length > 100
                ? email.slice(0, 100) + "..."
                : email || "N/A"}
            </Box>
          );
        },
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
        size: 150,
        Cell: ({ cell }) => {
          const [anchorEl, setAnchorEl] = useState(null);
          const open = Boolean(anchorEl);

          const handleMenuOpen = (event) => {
            setAnchorEl(event.currentTarget);
          };

          const handleMenuClose = () => {
            setAnchorEl(null);
          };

          return (
            <Box display="flex" justifyContent="center">
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>

              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() =>
                    handleViewPolicy(
                      cell.row.original,
                      cell.row.original.policyType
                    )
                  }
                >
                  View Form Details
                </MenuItem>

                <MenuItem
                  component={Link}
                  to={`/admin_portal/editor?qsr_type=${cell.row.original.policyType}&q_id=${cell.row.original.id}&qu_id=${cell.row.original.user.id}`}
                  disabled={cell.row.original.status === "pending"}
                >
                  Send Quote
                </MenuItem>

                <MenuItem
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
                >
                  {reminderLoader[cell.row.original.id]
                    ? "Sending..."
                    : "Send Reminder"}
                </MenuItem>

                <MenuItem
                  onClick={() => handleDeleteQuoteClick(cell.row.original)}
                  style={{ color: "red" }}
                >
                  Delete Quote
                </MenuItem>
              </Menu>
            </Box>
          );
        },
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
          // Ensure persons, drivers, or cell.getValue() are valid
          const name =
            (persons &&
              Array.isArray(persons) &&
              persons.length > 0 &&
              persons[0].name) ||
            (drivers &&
              Array.isArray(drivers) &&
              drivers.length > 0 &&
              drivers[0].name) ||
            cell.getValue() ||
            "N/A"; // Fallback if all are undefined
          return (
            <Box>{name?.length > 100 ? name.slice(0, 100) + "..." : name}</Box>
          );
        },
      },
      {
        accessorKey: "user.phoneNumber",
        header: "Client Contact no.",
        size: 200,
        Cell: ({ cell }) => {
          const value = cell.getValue() || "N/A"; // Fallback for undefined phoneNumber
          return (
            <Box>
              {value.length > 100 ? value.slice(0, 100) + "..." : value}
            </Box>
          );
        },
      },
      {
        accessorKey: "user.email",
        header: "Client Email",
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue() || "N/A"; // Fallback for undefined email
          return (
            <Box>
              {value.length > 100 ? value.slice(0, 100) + "..." : value}
            </Box>
          );
        },
      },
      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue() || "N/A"; // Fallback for undefined policy type
          return (
            <Box>
              {value.length > 100 ? value.slice(0, 100) + "..." : value}
            </Box>
          );
        },
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => {
          const { isBounded } = cell.row.original;

          return (
            <Box display="flex" alignItems="center" gap="18px">
              <button
                onClick={() => handleModal(cell.row.original)}
                className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
              >
                View Quote
              </button>
              {!isBounded && ( // ✅ Only show "Bind Quote" if isBounded is false
                <button
                  onClick={() => handleBindModal(cell.row.original)}
                  className="bg-[#1e5979] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
                >
                  Bind Quote
                </button>
              )}
            </Box>
          );
        },
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
        //Policy Bind Mail
        // AdminBindConfirmQuoteMail(
        //   data.user?.name,
        //   data.user?.email,
        //   data.qsr_type
        // );
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
        updatedAt: serverTimestamp(),
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
  const [bindQid, setBindQid] = useState();
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
            {cell?.getValue()?.length > 100
              ? cell?.getValue()?.slice(0, 100) + "..."
              : cell?.getValue()}
          </Box>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ cell }) => {
          const row = cell.row.original;
          const missingAges = !row.ac_age || !row.roof_age;
          return (
            <Box display="flex" alignItems="center" gap="18px">
              <button
                onClick={() => slideModalOpen(row)}
                className="bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]"
              >
                View Binder
              </button>
              <button
                disabled={boundLoader[row.id]}
                onClick={() => handleBoundPolicy(row, row.id)}
                className="bg-[#17A600] rounded-[18px] flex flex-row justify-center items-center gap-1 px-[16px] py-[4px] text-white text-[10px]"
              >
                {boundLoader[row.id] ? (
                  <>
                    <span>Binding</span>
                    <CircularProgress size={20} color="inherit" />
                  </>
                ) : (
                  "Bind Policy"
                )}
              </button>
              {missingAges && (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setAgeModalOpen(true);
                    setBindQid(row.id);
                  }}
                  sx={{ fontSize: 10, ml: 1 }}
                >
                  {!row.ac_age && !row.roof_age
                    ? "Add AC & Roof Age"
                    : !row.ac_age
                      ? "Add AC Age"
                      : "Add Roof Age"}
                </Button>
              )}
            </Box>
          );
        },
      },
    ],
    [boundLoader]
  );

  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [ageFields, setAgeFields] = useState({
    ac_age: "",
    roof_age: "",
  });
  const [ageLoading, setAgeLoading] = useState(false);
  const handleAgeSubmit = async () => {
    if (!ageFields.ac_age || !ageFields.roof_age) {
      toast.error("Both AC Age and Roof Age are required.");
      return;
    }

    try {
      setAgeLoading(true);

      const docRef = doc(db, "bind_req_quotes", bindQid);
      await updateDoc(docRef, {
        ac_age: ageFields.ac_age,
        roof_age: ageFields.roof_age,
      });

      toast.success("Ages updated!");

      setAgeModalOpen(false);
      getAllBinderRequestedQuotes();
      setBindQid(null);
    } catch (err) {
      console.error("Error updating ages:", err);
      toast.error("Error updating ages.");
    } finally {
      setAgeLoading(false);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDeleteClick = (policy) => {
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    if (selectedPolicy) {
      try {
        await deleteDoc(doc(db, "bound_policies", selectedPolicy.id));
        toast.success("Policy deleted successfully!");
        getAllPolicyBoundData();
      } catch (error) {
        toast.error("Error deleting policy!", error.message);
        console.error("Error deleting policy:", error);
      } finally {
        setOpenDialog(false);
        setSelectedPolicy(null);
        setDeleteLoading(false);
      }
    }
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPolicyData, setEditPolicyData] = useState(null);
  const handleEditPolicy = (policy) => {
    setEditPolicyData(policy);
    setIsEditMode(true);
    setOpenPolicyModal(true);
  };
  const handleCreatePolicy = () => {
    setEditPolicyData(null);
    setIsEditMode(false);
    setOpenPolicyModal(true);
  };

  //Attach Refrral requirements
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [selectedPolicyReferral, setSelectedPolicyReferral] = useState(null);

  const policy_bound_columns = useMemo(() => {
    return [
      {
        accessorKey: "user.name",
        header: "Client",
        size: 100,
        Cell: ({ cell }) => {
          const v = cell.getValue();
          return <Box>{v.length > 30 ? v.slice(0, 30) + "…" : v}</Box>;
        },
      },

      {
        accessorKey: "policy_number",
        header: "Policy Number",
        size: 120,
        Cell: ({ cell }) => {
          const v = cell.getValue() ?? "";
          return (
            <Box>
              {v ? (v.length > 30 ? v.slice(0, 30) + "…" : v) : "Not available"}
            </Box>
          );
        },
      },
      {
        accessorKey: "insured_address",
        header: "Insured Address",
        size: 200,
        Cell: ({ cell }) => {
          const v = cell.getValue() ?? "";
          return (
            <Box>
              {v ? (v.length > 30 ? v.slice(0, 30) + "…" : v) : "Not available"}
            </Box>
          );
        },
      },

      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
      },
      {
        accessorKey: "effective_date",
        header: "Effective Date",
        size: 100,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue())}</Box>,
      },
      {
        accessorKey: "exp_date",
        header: "Expiration Date",
        size: 100,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue())}</Box>,
      },
      // {
      //   accessorKey: "Refe",
      //   header: "Referral",
      //   size: 120,
      //   Cell: ({ row }) => {
      //     const data = row?.original;
      //     return data?.byReferral ? (
      //       <Box>{data?.Referral?.name}</Box>
      //     ) : (
      //       <Button
      //         size="small"
      //         onClick={() => {
      //           setSelectedPolicyReferral(data);
      //           setRefModalOpen(true);
      //         }}
      //         variant="contained"
      //         sx={{
      //           bgcolor: "#005270",
      //           "&:hover": { bgcolor: "#003049" },
      //           borderRadius: "8px",
      //           textTransform: "none",
      //         }}
      //       >
      //         Attach
      //       </Button>
      //     );
      //   },
      // },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        Cell: ({ cell }) => {
          // local state per-row for menu anchor
          const [anchorEl, setAnchorEl] = useState(null);
          const open = Boolean(anchorEl);
          const row = cell.row.original;

          const handleOpen = (e) => setAnchorEl(e.currentTarget);
          const handleClose = () => setAnchorEl(null);

          return (
            <>
              <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    slideModalOpen(row);
                    handleClose();
                  }}
                >
                  View Policy
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleEditPolicy(row);
                    handleClose();
                  }}
                >
                  Edit Policy
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDeleteClick(row);
                    handleClose();
                  }}
                  sx={{ color: (theme) => theme.palette.error.main }}
                >
                  Delete Policy
                </MenuItem>
              </Menu>
            </>
          );
        },
      },
    ];
  }, []);

  const [deleteExpiredLoader, setdeleteExpiredLoader] = useState({});
  const [setselectedExpiredPolicy, setSetselectedExpiredPolicy] =
    useState(null);
  const [openExpiredDialog, setOpenExpiredDialog] = useState(null);
  const handleExpiredDeleteClick = (policy) => {
    setSetselectedExpiredPolicy(policy);
    setOpenExpiredDialog(true);
  };
  const deleteExpiredPolicy = async () => {
    try {
      // Set loading state for this document id
      setdeleteExpiredLoader((prevState) => ({
        ...prevState,
        [setselectedExpiredPolicy?.id]: true,
      }));

      // Get a reference to the document directly using the document id.
      const policyDocRef = doc(
        db,
        "bound_policies",
        setselectedExpiredPolicy?.id
      );

      // Delete the document
      await deleteDoc(policyDocRef);

      // Show success message and refresh data
      toast.success("Expired Policy deleted successfully.");
      getAllPolicyBoundData();
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      // Reset loading state for this document id
      setdeleteExpiredLoader((prevState) => ({
        ...prevState,
        [setselectedExpiredPolicy?.id]: false,
      }));
      setOpenExpiredDialog(false);
    }
  };
  // const deleteExpiredPolicy = async (id) => {
  //   console.log("id", id);
  //   try {
  //     setdeleteExpiredLoader((prevState) => ({ ...prevState, [id]: true }));
  //     const policiesCollectionRef = collection(db, "bound_policies");
  //     const q = query(policiesCollectionRef, where("id", "==", id));

  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach(async (doc) => {
  //       const policyDocRef = doc.ref;
  //       await deleteDoc(policyDocRef);
  //       toast.success(`Expired Policy deleted successfully.`);
  //       getAllPolicyBoundData();
  //     });
  //   } catch (error) {
  //     console.error("Error deleting documents: ", error);
  //   } finally {
  //     setdeleteExpiredLoader((prevState) => ({ ...prevState, [id]: false }));
  //   }
  // };

  const policy_history_columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Client",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {cell.getValue().length > 100
              ? cell.getValue().slice(0, 100) + "…"
              : cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "policy_number",
        header: "Policy Number",
        size: 120,
        Cell: ({ cell }) => {
          const v = cell.getValue() ?? "";
          return (
            <Box>
              {v ? (v.length > 30 ? v.slice(0, 30) + "…" : v) : "Not available"}
            </Box>
          );
        },
      },
      {
        accessorKey: "insured_address",
        header: "Insured Address",
        size: 200,
        Cell: ({ cell }) => {
          const v = cell.getValue() ?? "";
          return (
            <Box>
              {v ? (v.length > 30 ? v.slice(0, 30) + "…" : v) : "Not available"}
            </Box>
          );
        },
      },
      {
        accessorKey: "qsr_type",
        header: "Policy Type",
        size: 100,
        Cell: ({ cell }) => {
          const v = cell.getValue() ?? "";
          return <Box>{v.length > 40 ? v.slice(0, 40) + "…" : v}</Box>;
        },
      },
      {
        header: "Effective Dates",
        size: 100,
        Cell: ({ cell }) => (
          <Box>
            {`B: ${formatDate(cell.row.original.bound_date)} - E: ${formatDate(
              cell.row.original.effective_date
            )}`}
          </Box>
        ),
      },
      {
        accessorKey: "exp_date",
        header: "Expiration Date",
        size: 100,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue())}</Box>,
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        Cell: ({ cell }) => {
          const [anchorEl, setAnchorEl] = useState(null);
          const open = Boolean(anchorEl);
          const row = cell.row.original;

          const handleOpen = (e) => setAnchorEl(e.currentTarget);
          const handleClose = () => setAnchorEl(null);

          return (
            <>
              <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    slideModalOpen(row);
                    handleClose();
                  }}
                >
                  View Policy
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleExpiredDeleteClick(row);
                    handleClose();
                  }}
                  sx={{ color: (theme) => theme.palette.error.main }}
                >
                  Delete Policy
                </MenuItem>
              </Menu>
            </>
          );
        },
      },
    ],
    [deleteExpiredLoader]
  );

  const [openQuoteModal, setOpenQuoteModal] = useState(false);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);

  //for renewal quotes
  const [renewalQuotes, setRenewalQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const renewalColumns = [
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
      Cell: ({ cell }) => <Box>{formatDate(cell.getValue())}</Box>,
    },
    {
      accessorKey: "user.name",
      header: "Client",
      size: 200,
    },
    {
      accessorKey: "user.email",
      header: "Client Email",
      size: 200,
    },
    // {
    //   // show referral name or “No Referral”
    //   accessorFn: (row) =>
    //     row.byReferral
    //       ? (row.Referral && row.Referral.name) || "—"
    //       : "No Referral",
    //   id: "referral",
    //   header: "Referral",
    // },
    {
      accessorFn: (row) => row.referralInfo?.name || "No Referral",
      id: "referral",
      header: "Referral",
    },
    {
      accessorFn: (row) => (row.isBounded ? "Activated" : "Not Yet Activated"),
      id: "isBounded",
      header: "Bounded",
      size: 120,
    },
    {
      accessorFn: (row) =>
        (row.renewalSourceIds && row.renewalSourceIds.length) || 0,
      id: "sources",
      header: "# of Sources",
    },
  ];
  const handleViewQuote = (quote) => { };
  // Fetch total count of quotes
  const fetchTotalQuotes = async () => {
    try {
      const q = query(
        collection(db, "prep_quotes"),
        where("isRenewal", "==", true)
      );
      const snapshot = await getCountFromServer(q);
      setTotalQuotes(snapshot.data().count);
    } catch (error) {
      console.error("Error fetching total renewal quotes count:", error);
    }
  };

  // Fetch quotes for the current page
  const fetchRenewalQuotes = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "prep_quotes"),
        where("isRenewal", "==", true),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);

      const quotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Collect emails
      const emails = quotes.map(quote => quote?.user?.email?.toLowerCase() || quote?.email?.toLowerCase());

      // Batch fetch
      const referralMap = await batchGetReferralMetaByEmails(emails);

      // Enrich
      const enrichedQuotes = quotes.map(quote => {
        const email = quote?.user?.email?.toLowerCase() || quote?.email?.toLowerCase();
        return { ...quote, referralInfo: referralMap[email] || {} };
      });

      setRenewalQuotes(enrichedQuotes);
    } catch (error) {
      console.error("Error fetching renewal quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total count on component mount
  useEffect(() => {
    fetchTotalQuotes();
  }, []);

  // Fetch total count and initial quotes when selectedButton changes
  useEffect(() => {
    if (selectedButton === "renewalQuotes") {
      fetchRenewalQuotes();
    }
  }, [selectedButton]);

  //Pre renewal quotes submission ,using same component that we were using for simple quote submission
  const [openPreRenewalQuoteModal, setOpenPreRenewalQuoteModal] =
    useState(false);

  const renderSkeleton = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  const navigate = useNavigate();
  const preRenewalColumns = [
    {
      accessorKey: "Name",
      header: "Client Name",
      size: 200,
    },
    {
      accessorKey: "Email",
      header: "Client Email",
      size: 200,
    },
    {
      accessorKey: "Address",
      header: "Property Address",
      size: 220,
    },
    {
      accessorKey: "Carrier",
      header: "Carrier",
      size: 180,
    },
    {
      accessorFn: (row) => row.referralInfo?.name || "No Referral",
      id: "referral",
      header: "Referral",
      size: 180,
    },
    // {
    //   accessorKey: "zipCode",
    //   header: "Zip Code",
    //   size: 100,
    // },
    {
      accessorKey: "receivedAtFormatted",
      header: "Received At",
      size: 150,
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      size: 140,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => {
        const email = row.original.Email;
        return (
          <Button
            size="sm"
            variant="contained"
            sx={{
              bgcolor: "#005270",
              "&:hover": { bgcolor: "#003049" },
              borderRadius: "8px",
              textTransform: "none",
            }}
            onClick={() =>
              navigate(
                `/admin_portal/renewal?email=${encodeURIComponent(
                  email
                )}&qsr_type=Home`
              )
            }
          >
            Send Quote
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        {/* <div className="w-[95%] mx-auto flex flex-wrap gap-2">
          {[
            {
              key: "requestedQuotes",
              label: "Requested Quotes",
              count: req_quotes?.length || 0,
              icon: papericon,
            },
            {
              key: "preRenewalQuotes",
              label: "Pre-Renewal Quotes",
              count: preRenewalQuotes?.length || 0,
              icon: papericon,
            },
            {
              key: "deliveredQuotes",
              label: "Delivered Quotes",
              count: del_quotes?.length || 0,
              icon: boxicon,
            },
            {
              key: "policyBound",
              label: "Active Policies",
              count: policy_bound_data?.length || 0,
              icon: peopleicon,
            },
            {
              key: "policyHistory",
              label: "Expired Policies",
              count: policy_history_data?.length || 0,
              icon: historyicon,
            },
            {
              key: "binderRequested",
              label: "Binder Requested",
              count: binder_req_quotes?.length || 0,
              icon: tickicon,
            },
            {
              key: "preAssignQuotes",
              label: "Pre Renewal Quotes",
              count: preAssignQuotes?.length || 0,
              icon: boxicon,
            },
            {
              key: "renewalQuotes",
              label: "Renewal Quotes",
              count: totalQuotes || 0,
              icon: boxicon,
            },
          ].map(({ key, label, count, icon }) => (
            <button
              key={key}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg transition-all duration-75 cursor-pointer ${
                selectedButton === key
                  ? "bg-[#003049] text-white"
                  : "bg-white text-gray-800 hover:bg-[#003049] hover:text-white"
              }`}
              onClick={() => handleButtonClick(key)}
            >
              <img src={icon} alt={`${label} icon`} className="w-6 h-6" />
              <span className="text-sm font-semibold">{label}</span>
              <span className="bg-gray-200 text-gray-800 text-xs font-light px-2 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          ))}
        </div> */}
        {/* <div className="w-[95%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {[
            {
              key: "requestedQuotes",
              label: "Requested Quotes",
              count: req_quotes?.length || 0,
              icon: papericon,
            },
            {
              key: "preRenewalQuotes",
              label: "Pre-Renewal Quotes",
              count: preRenewalQuotes?.length || 0,
              icon: papericon,
            },
            {
              key: "deliveredQuotes",
              label: "Delivered Quotes",
              count: del_quotes?.length || 0,
              icon: boxicon,
            },
            {
              key: "policyBound",
              label: "Active Policies",
              count: policy_bound_data?.length || 0,
              icon: peopleicon,
            },
            {
              key: "policyHistory",
              label: "Expired Policies",
              count: policy_history_data?.length || 0,
              icon: historyicon,
            },
            {
              key: "binderRequested",
              label: "Binder Requested",
              count: binder_req_quotes?.length || 0,
              icon: tickicon,
            },
            {
              key: "preAssignQuotes",
              label: "Pre Renewal Quotes",
              count: preAssignQuotes?.length || 0,
              icon: boxicon,
            },
            {
              key: "renewalQuotes",
              label: "Renewal Quotes",
              count: totalQuotes || 0,
              icon: boxicon,
            },
          ].map(({ key, label, count, icon }) => (
            <div
              key={key}
              className={`group hover:bg-[#003049] p-2 transition-all duration-75 cursor-pointer rounded-lg shadow-sm flex items-center gap-2 ${
                selectedButton === key
                  ? "bg-[#003049] text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => handleButtonClick(key)}
              role="button"
              aria-label={`View ${label}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleButtonClick(key)}
            >
              <img src={icon} alt={`${label} icon`} className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold group-hover:text-white">
                  {label}
                </p>
                <p className="text-xs font-light group-hover:text-white">
                  {count}
                </p>
              </div>
            </div>
          ))}
        </div> */}
        <div className="w-[95%] mx-auto">
          {/* Desktop/Tablet Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                key: "requestedQuotes",
                label: "Requested Quotes",
                count: req_quotes?.length || 0,
                icon: papericon,
              },
              {
                key: "preRenewalQuotes",
                label: "Manual Renewals Requested",
                count: preRenewalQuotes?.length || 0,
                icon: papericon,
              },
              {
                key: "deliveredQuotes",
                label: "Delivered Quotes",
                count: del_quotes?.length || 0,
                icon: boxicon,
              },
              {
                key: "binderRequested",
                label: "Binder Req.",
                count: binder_req_quotes?.length || 0,
                icon: tickicon,
              },
              {
                key: "policyBound",
                label: "Active Policies",
                count: policy_bound_data?.length || 0,
                icon: peopleicon,
              },
              {
                key: "policyHistory",
                label: "Expired",
                count: policy_history_data?.length || 0,
                icon: historyicon,
              },

              {
                key: "preAssignQuotes",
                label: "CMS Quotes",
                count: preAssignQuotes?.length || 0,
                icon: boxicon,
              },
              {
                key: "renewalQuotes",
                label: "Renewal",
                count: totalQuotes || 0,
                icon: boxicon,
              },
            ].map(({ key, label, count, icon }) => (
              <button
                key={key}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all duration-75 cursor-pointer shadow-sm ${selectedButton === key
                  ? "bg-[#003049] text-white"
                  : "bg-white text-gray-800 hover:bg-[#003049] hover:text-white"
                  }`}
                onClick={() => handleButtonClick(key)}
                role="tab"
                aria-label={`View ${label}`}
                aria-selected={selectedButton === key}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleButtonClick(key)}
              >
                <div className="flex items-center gap-1.5">
                  <img src={icon} alt={`${label} icon`} className="w-5 h-5" />
                  <span className="text-md font-medium truncate">{label}</span>
                </div>
                <span className="bg-gray-200 text-gray-800 text-xs font-light px-1.5 py-0.5 rounded-full group-hover:bg-white group-hover:text-gray-800">
                  {count}
                </span>
              </button>
            ))}
          </div>
          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <select
              className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm"
              onChange={(e) => handleButtonClick(e.target.value)}
              value={selectedButton}
            >
              {[
                {
                  key: "requestedQuotes",
                  label: "Requested Quotes",
                  count: req_quotes?.length || 0,
                },
                {
                  key: "preRenewalQuotes",
                  label: "Manual Renewals Quotes",
                  count: preRenewalQuotes?.length || 0,
                },
                {
                  key: "deliveredQuotes",
                  label: "Delivered Quotes",
                  count: del_quotes?.length || 0,
                },
                {
                  key: "policyBound",
                  label: "Active Policies",
                  count: policy_bound_data?.length || 0,
                },
                {
                  key: "policyHistory",
                  label: "Expired Policies",
                  count: policy_history_data?.length || 0,
                },
                {
                  key: "binderRequested",
                  label: "Binder Requested",
                  count: binder_req_quotes?.length || 0,
                },
                {
                  key: "preAssignQuotes",
                  label: "Pre Renewal Quotes",
                  count: preAssignQuotes?.length || 0,
                },
                {
                  key: "renewalQuotes",
                  label: "Renewal Quotes",
                  count: totalQuotes || 0,
                },
              ].map(({ key, label, count }) => (
                <option key={key} value={key}>
                  {label} ({count})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-4 w-full justify-end mt-4">
          <Tooltip title="Submit A Quote For Client/Referral" placement="top">
            <Button
              onClick={() => setOpenQuoteModal(true)}
              variant="contained"
              sx={{
                bgcolor: "#005270",
                "&:hover": { bgcolor: "#003049" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Submit Quote
            </Button>
          </Tooltip>
          <Tooltip
            title="Submit a pre-renewal quote for a client/referral"
            placement="top"
          >
            <Button
              onClick={() => setOpenPreRenewalQuoteModal(true)}
              variant="contained"
              sx={{
                bgcolor: "#005270",
                "&:hover": { bgcolor: "#003049" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Pre-Renewal Quote
            </Button>
          </Tooltip>

          <Tooltip title="Create a new policy for Client" placement="top">
            <Button
              onClick={handleCreatePolicy}
              variant="contained"
              sx={{
                bgcolor: "#005270",
                "&:hover": { bgcolor: "#003049" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              Create Policy
            </Button>
          </Tooltip>
        </div>
        <AdminUserSelectDialog
          db={db}
          buttonText="Submit Quote"
          open={openQuoteModal}
          setOpen={setOpenQuoteModal}
        />
        <AdminUserSelectDialog
          db={db}
          buttonText="Submit Quote"
          open={openPreRenewalQuoteModal}
          setOpen={setOpenPreRenewalQuoteModal}
          PreRenwalQuote={true}
        />
        <PolicyCreationModal
          getAllPolicyBoundData={getAllPolicyBoundData}
          isOpen={openPolicyModal}
          setIsOpen={setOpenPolicyModal}
          editData={editPolicyData}
          isEditMode={isEditMode}
        />

        {selectedButton === "requestedQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {req_quotes && req_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={req_columns}
                  data={req_quotes}
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Quotes Found" icon="inbox" />
            )}
          </div>
        )}
        {selectedButton === "preRenewalQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {preRenewalQuotes && preRenewalQuotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={req_columns}
                  data={preRenewalQuotes}
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Quotes Found" icon="inbox" />
            )}
          </div>
        )}

        {selectedButton === "deliveredQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-[30px]">
            {del_quotes && del_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable
                  columns={del_columns}
                  data={del_quotes}
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Quotes Found" icon="inbox" />
            )}

            <DeliveredQuotePreviewAdmin
              data={popupValue}
              openModal={openModal}
              onClose={handleModalClose}
            />

            <DeliveredQuotePreviewAdmin
              data={popupValue}
              openModal={openBindModal}
              onClose={handleBindModalClose}
              bindQuote={true}
              getAllDeliveredQuotes={getAllDeliveredQuotes}
              getAllBinderRequestedQuotes={getAllBinderRequestedQuotes}
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
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Quotes Found" icon="inbox" />
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
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Policy Bound Found" icon="sad" />
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
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Expired Policies Found" icon="happy" />
            )}

            <BinderReqPreview
              data={BinderPopValue}
              isSlideModalOpen={slideModal}
              onClose={slideModalClose}
            />
          </div>
        )}
        {selectedButton === "renewalQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-8">
            {loading ? (
              <div className="w-full text-center py-8">{renderSkeleton()}</div>
            ) : renewalQuotes.length > 0 ? (
              <div className="w-full">
                <MaterialReactTable
                  columns={renewalColumns}
                  data={renewalQuotes}
                  muiToolbarAlertBannerProps={
                    loading
                      ? { color: "info", children: "Loading data..." }
                      : undefined
                  }
                  initialState={{ density: "compact" }}
                />
              </div>
            ) : (
              <EmptyState message="No Renewal Quotes Found" icon="inbox" />
            )}
          </div>
        )}
        {selectedButton === "preAssignQuotes" && (
          <div className="w-full flex flex-col justify-center items-center mt-4">
            {quotesLoading ? (
              <div className="w-full text-center py-10">{renderSkeleton()}</div>
            ) : preAssignQuotes.length > 0 ? (
              <>
                <div className="flex justify-end w-full max-w-7xl mb-4">
                  <Button onClick={fetchQuotes} variant="outline">
                    🔄 Refresh Quotes
                  </Button>
                </div>

                <div className="w-full ">
                  <MaterialReactTable
                    columns={preRenewalColumns}
                    data={preAssignQuotes}
                    muiToolbarAlertBannerProps={
                      quotesLoading
                        ? { color: "info", children: "Loading data..." }
                        : undefined
                    }
                    initialState={{ density: "compact" }}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 mt-16">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    No Pre-Renewal Quotes Yet
                  </h3>
                  <p className="text-gray-500">
                    Click the button below to fetch the latest renewal quotes.
                  </p>
                </div>

                <Button
                  onClick={fetchQuotes}
                  className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all duration-200"
                >
                  📥 Fetch Renewal Quotes
                </Button>
              </div>
            )}
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
      <Modal
        open={ageModalOpen}
        onClose={() => setAgeModalOpen(false)}
        aria-labelledby="add-ages-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h2 className="font-bold text-lg mb-2">Add AC Age and Roof Age</h2>
          <TextField
            label="AC Age (years)"
            type="number"
            value={ageFields.ac_age}
            onChange={(e) =>
              setAgeFields((prev) => ({ ...prev, ac_age: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Roof Age (years)"
            type="number"
            value={ageFields.roof_age}
            onChange={(e) =>
              setAgeFields((prev) => ({ ...prev, roof_age: e.target.value }))
            }
            fullWidth
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              size="sm"
              color="error"
              onClick={() => setAgeModalOpen(false)}
              disabled={ageLoading}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              variant="outlined"
              onClick={handleAgeSubmit}
              disabled={ageLoading}
            >
              {ageLoading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        fullWidth
        open={openExpiredDialog}
        onClose={() => setOpenExpiredDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Expired policy?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenExpiredDialog(false)}
            color="primary"
            variant="contained"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteExpiredPolicy}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this policy?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            variant="contained"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this quote? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteQuote}
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <AttachReferralModal
        open={refModalOpen}
        onClose={() => {
          setRefModalOpen(false);
          getAllPolicyBoundData();
        }}
        policy={selectedPolicyReferral}
      />

      {/* AC Age and Roof Age check */}
    </>
  );
};

export default QuotesPage;
