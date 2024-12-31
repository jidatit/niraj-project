import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
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

const EditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [QSR_Type, setQSR_Type] = useState("");
  const [Q_id, setQ_id] = useState("");
  const [buttonText, setButtonText] = useState("Submit Quote");
  const [Agents, setAgents] = useState([]);
  const [IsDelivered, setIsDelivered] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);

  const checkAlreadyDeliveredQuote = async (type, id) => {
    try {
      const collectionRef = getType(type);
      const docRef = doc(db, collectionRef, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().status_step === "2") {
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
    if ((QSR_Type, Q_id)) checkAlreadyDeliveredQuote(QSR_Type, Q_id);
  }, [QSR_Type, Q_id]);

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
        };
      }
    } catch (error) {
      console.log("error getting document: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const qsrTypeParam = searchParams.get("qsr_type");
      const q_id = searchParams.get("q_id");
      setQ_id(q_id);
      setQSR_Type(qsrTypeParam);
      setFormData((prevData) => ({
        ...prevData,
        qsr_type: qsrTypeParam,
        q_id: q_id,
      }));
      const inuser = await getQuoteDetails(qsrTypeParam, q_id);
      setFormData((prevData) => ({
        ...prevData,
        user: inuser,
      }));
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
      setSubBtnDisabler(true);
      if (Object.keys(formData.user).length === 0) {
        toast.warn("Select a user!");
        return;
      }
      if (Object.keys(formData.agent).length === 0) {
        toast.warn("Select a agent!");
        return;
      }
      if (areKeysFilled(formData.tablesData.table_1) === false) {
        toast.warn("Table 1 has empty value(s)");
        return;
      }
      setButtonText("Submitting Quote");
      await addDoc(collection(db, "prep_quotes"), formData);

      await updateStatusStep(QSR_Type, Q_id);

      AdminPrepareQuoteMail(formData.user.name, formData.user.email, QSR_Type);
      toast.success("Quote prepared successfully!");
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

  const updateStatusStep = async (type, id) => {
    try {
      const collectionRef = getType(type);
      const docRef = doc(db, collectionRef, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          status_step: "2",
        });
      }
    } catch (error) {
      toast.error("Error updating status!");
    }
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <ToastContainer />

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
              Quote Already Delivered for type:{" "}
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

            {QSR_Type && formData.user && (
              <CustomTable
                QSR={QSR_Type}
                tableData={getDatafromTable}
                user={formData.user}
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

export default EditorPage;
