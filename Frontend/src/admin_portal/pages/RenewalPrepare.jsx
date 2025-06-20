import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import CustomTable from "../components/CustomTable";
import Button from "../components/Button";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
  limit,
  setDoc,
} from "firebase/firestore";

import { db } from "../../../db";
import {
  areKeysFilled,
  getCurrentDate,
  getType,
} from "../../utils/helperSnippets";
import { AdminPrepareQuoteMail } from "../../utils/mailingFuncs";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import NotesSection from "../components/NotesSection";
import { fetchQuotesByEmail } from "../../utils/fetchQuotes";
import { sendRenewalQuoteNotifications } from "../../utils/EmailNotification";
function generateQid(randomCharsCount = 6) {
  const tsPart = Date.now().toString(36); // timestamp in base36
  const randPart = Array.from({ length: randomCharsCount })
    .map(() => Math.floor(Math.random() * 36).toString(36)) // random base36 chars
    .join("");
  return `${tsPart}${randPart}`;
}
const RenewalPrepare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [QSR_Type, setQSR_Type] = useState("");
  const [Q_id, setQ_id] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [buttonText, setButtonText] = useState("Submit Quote");
  const [Agents, setAgents] = useState([]);
  const [IsDelivered, setIsDelivered] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [renewalQuote, setRenewalQuote] = useState([]);
  const checkAlreadyDeliveredQuote = async (isProcessed) => {
    try {
      if (isProcessed === true) {
        setIsDelivered(true);
      } else {
        setIsDelivered(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (renewalQuote?.[0]) {
      checkAlreadyDeliveredQuote(renewalQuote[0]?.isProcessed);
    }
  }, [renewalQuote]);

  const [formData, setFormData] = useState({
    user: {},
    agent: {
      value: "eFvH8aSduCPeMEdtWnDeUkecnXr2",
      label: `admin - admin@admin.com`,
      id: "eFvH8aSduCPeMEdtWnDeUkecnXr2",
      company_name: "Jidat Admin",
      company_address: "USA ASADDsDDS",
      phone_1: "45345376",
      phone_2: "45345345",
      name: "Admin",
      email: "admin@admin.com",
    },
    tablesData: { table_1: {}, table_2: {} },
    qsr_type: "",
    date: getCurrentDate("slash"),
    q_id: "",
    notes: [],
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const ref = collection(db, "agents");
        const snapshot = await getDocs(ref);
        const AgentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const prep_options = AgentsData.map((user) => ({
          value: user.id,
          label: `${user.name} - ${user.email}`,
          ...user,
        }));
        setAgents(prep_options);
      } catch (error) {
        console.error("Error fetching Agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const getQuoteDetails = async (type, q_id) => {
    try {
      const collectionRef = getType(type);
      const docRef = doc(db, collectionRef, q_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          ...docSnap.data().inuser,
          value: docSnap.data().inuser?.email,
          label: docSnap.data().inuser?.email,
          address: docSnap.data().address
            ? docSnap.data().address
            : docSnap.data().garaging_address,
          mailingAddress: docSnap.data().mailingAddress,
          byReferral: docSnap?.data()?.byReferral || false,
          ReferralId: docSnap?.data()?.ReferralId || "",
          Referral: docSnap?.data()?.Referral || "",
        };
      }
    } catch (error) {
      console.log("error getting document: ", error);
    }
  };
  const getQuoteDetailsByEmail = async (renewalQuote) => {
    const email = renewalQuote?.email?.toLowerCase();
    if (!email) {
      console.warn("No email provided for getQuoteDetailsByEmail");
      return null;
    }

    try {
      // 1. Try to fetch most recent quote from prep_quotes
      const previousQuotesQuery = query(
        collection(db, "prep_quotes"),
        where("user.email", "==", email)
      );

      const previousQuotesSnapshot = await getDocs(previousQuotesQuery);
      const previousQuotes = previousQuotesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const mostRecentQuote = previousQuotes.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];

      let userData = null;

      let byReferral = false;
      let ReferralId = "";
      let Referral = "";

      if (!mostRecentQuote) {
        // 2. Fallback: check bound_policies
        const boundPoliciesQuery = query(
          collection(db, "bound_policies"),
          where("user.email", "==", email),
          limit(1)
        );

        const boundPoliciesSnapshot = await getDocs(boundPoliciesQuery);

        if (!boundPoliciesSnapshot.empty) {
          const latestPolicy = boundPoliciesSnapshot.docs[0].data();
          userData = latestPolicy.user;
          byReferral = latestPolicy.user?.byReferral || false;
          ReferralId = latestPolicy.user?.ReferralId || "";
          Referral = latestPolicy.user?.Referral || "";
        } else {
          // 3. Final fallback: use minimal info from renewalQuote
          userData = {
            email: renewalQuote.Email,
            name: "",
            address: renewalQuote.Address || "",
            zipCode: renewalQuote.zipCode || "",
            phoneNumber: "",
            mailingAddress: renewalQuote.Address || "",
            label: renewalQuote.Email,
            value: renewalQuote.Email,
          };
        }
      } else {
        // Use data from existing prep quote
        userData = mostRecentQuote.user;
        byReferral = mostRecentQuote.user?.byReferral || false;
        ReferralId = mostRecentQuote.user?.ReferralId || "";
        Referral = mostRecentQuote.user?.Referral || "";
      }

      return {
        ...userData,
        label: userData?.email,
        value: userData?.email,
        address: userData?.address || userData?.garaging_address || "",
        mailingAddress: userData?.mailingAddress || "",
        byReferral,
        ReferralId,
        Referral,
      };
    } catch (error) {
      console.error("Error getting quote details by email:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const qsrTypeParam = searchParams.get("qsr_type");
      const q_id = generateQid();
      const email = searchParams.get("email");

      setQ_id(q_id);
      setUserEmail(email);
      setQSR_Type(qsrTypeParam);
      const results = await fetchQuotesByEmail(email);
      setRenewalQuote(results);
      setFormData((prevData) => {
        const updated = {
          ...prevData,
          qsr_type: qsrTypeParam,
          q_id: q_id,
        };
        return updated;
      });

      const inuser = await getQuoteDetailsByEmail(results[0]);

      setFormData((prevData) => {
        const updated = {
          ...prevData,
          insured_address: inuser?.address,
          user: inuser,
          byReferral: inuser?.byReferral || false,
          ReferralId: inuser?.ReferralId || "",
          Referral: inuser?.Referral || "",
        };
        return updated;
      });
    };

    fetchData();
  }, [location.search]);

  const getDatafromTable = (dataFromTable, tableNumber) => {
    if (tableNumber === 1) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tablesData: {
          ...prevFormData.tablesData,
          table_1: dataFromTable,
        },
      }));
    } else if (tableNumber === 2) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tablesData: {
          ...prevFormData.tablesData,
          table_2: dataFromTable,
        },
      }));
    }
  };

  const [subBtnDisabler, setSubBtnDisabler] = useState(false);

  const handlePrepQuote = async () => {
    try {
      const updatedFormData = {
        ...formData,
        status_step: "3",
        isRenewal: true,
        renewalSourceIds: Array.isArray(renewalQuote)
          ? renewalQuote.map((quote) => quote.id)
          : [],
      };

      setSubBtnDisabler(true);
      if (Object.keys(formData?.user).length === 0) {
        toast.warn("Select a user!");
        return;
      }
      if (Object.keys(formData?.agent).length === 0) {
        toast.warn("Select a agent!");
        return;
      }
      if (areKeysFilled(formData?.tablesData?.table_1) === false) {
        toast.warn("Table 1 has empty value(s)");
        return;
      }

      setButtonText("Submitting Quote");

      await setDoc(doc(db, "prep_quotes", Q_id), updatedFormData);

      await updateStatusStep(renewalQuote);

      //   AdminPrepareQuoteMail(
      //     formData?.user?.name,
      //     formData?.user?.email,
      //     QSR_Type
      //   );
      await sendRenewalQuoteNotifications(updatedFormData, renewalQuote);
      toast.success("Renewal Quote prepared successfully!");
      setButtonText("Submit Quote");
      setTimeout(() => {
        navigate("/admin_portal");
      }, 2000);
    } catch (error) {
      toast.error("Error preparing quote!");
    } finally {
      setSubBtnDisabler(false);
    }
  };

  const updateStatusStep = async (renewalQuotes = []) => {
    if (!Array.isArray(renewalQuotes) || renewalQuotes.length === 0) return;

    try {
      const updatePromises = renewalQuotes.map(async (rq) => {
        const renewalQuoteRef = doc(db, "renewal_quotes", rq?.id);
        await updateDoc(renewalQuoteRef, {
          processed: true,
          processedAt: new Date().toISOString(),
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating renewal quotes:", error);
      toast.error("Error updating status!");
    }
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        {IsLoading ? (
          <CircularProgress />
        ) : IsDelivered ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: "#003049",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                padding: "8px 16px",
                borderRadius: "8px",
                boxShadow: 2,
              }}
            >
              Renewal Quote Already Delivered for type:{" "}
              <span style={{ fontWeight: "bold" }}>{QSR_Type}</span> and Id:{" "}
              <span style={{ fontWeight: "bold" }}>{Q_id}</span>
            </Typography>
          </Box>
        ) : (
          <>
            <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
              <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
                Prepare Quote for & Agent:
              </h1>
            </div>
            <div className="w-[90%] grid grid-cols-1 mt-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
              <div className="w-full z-30 flex flex-col justify-center items-start gap-2">
                <label
                  className="font-semibold text-[20px] text-start"
                  htmlFor="users"
                >
                  Select User
                </label>
                {formData.user && (
                  <Select
                    id="users"
                    isDisabled={true}
                    value={formData.user}
                    onChange={(selectedUser) =>
                      setFormData({ ...formData, user: selectedUser })
                    }
                    name="user"
                    className="w-full"
                    options={formData.user}
                  />
                )}
              </div>
              <div className="w-full flex z-20 flex-col justify-center items-start gap-2">
                <label
                  className="font-semibold text-[20px] text-start"
                  htmlFor="agents"
                >
                  Select Agent
                </label>
                {Agents && (
                  <Select
                    id="agents"
                    value={formData.agent}
                    onChange={(selectedAgent) =>
                      setFormData({ ...formData, agent: selectedAgent })
                    }
                    name="agent"
                    className="w-full"
                    options={Agents}
                  />
                )}
              </div>
            </div>

            <div className="w-[90%] flex mt-[20px] mb-[20px] flex-col gap-5 justify-center items-start">
              {QSR_Type && (
                <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
                  Quote Summary Report{" "}
                  <span className="font-semibold">({QSR_Type})</span>
                </h1>
              )}
            </div>
            <div className="w-[90%] flex   flex-col gap-4 justify-center items-start">
              <NotesSection formData={formData} setFormData={setFormData} />
            </div>

            {QSR_Type && formData.user && (
              <CustomTable
                QSR={QSR_Type}
                tableData={getDatafromTable}
                user={formData.user}
                isRenewal={true}
                renewalQuote={renewalQuote}
              />
            )}

            <div className="w-[90%] mt-[20px] flex flex-col justify-end items-end">
              <div className="md:w-[30%] w-full pr-0 md:pr-2">
                <Button
                  isDisabled={subBtnDisabler}
                  onClickProp={handlePrepQuote}
                  text={buttonText}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RenewalPrepare;
