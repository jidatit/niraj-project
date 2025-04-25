import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../db";
import { getDocs, collection } from "firebase/firestore";
import DeliveredQuotePreviewClient from "../components/DeliveredQuotePreviewClient";
import { Box, CircularProgress } from "@mui/material";

const PolicyQuoteResults = () => {
  const location = useLocation();
  const [QuoteDetails, setQuoteDetails] = useState(null);
  const [id, setId] = useState("");
  const [alreadyBindreq, setalreadyBindreq] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const IdParam = searchParams.get("id");
    setId(IdParam);
    const fetchData = async () => {
      const alreadyRequested = await checkAlreadyQuoteRequested(IdParam);

      if (!alreadyRequested) {
        getQuoteRes(IdParam);
      }
    };

    fetchData();
  }, [location.search]);

  const getQuoteRes = async (id) => {
    try {
      const querySnapshot = await getDocs(collection(db, "prep_quotes"));
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.q_id === id) {
          const quoteDetails = { ...docData, id: doc.id };

          setQuoteDetails(quoteDetails);
        }
      });
    } catch (error) {
      toast.error("Error Fetching Result For Your Quote!");
    } finally {
      setLoading(false);
    }
  };

  const checkAlreadyQuoteRequested = async (id) => {
    try {
      const querySnapshot = await getDocs(collection(db, "bind_req_quotes"));
      for (const doc of querySnapshot.docs) {
        const docData = doc.data();
        if (docData.qid === id) {
          setalreadyBindreq(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log("Error checking quote request:", error);
      return false;
    }
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        {alreadyBindreq === false ? (
          <>
            <div className="w-[95%] flex flex-col gap-5 justify-center items-start">
              <h1 className="text-black font-bold text-[25px] mt-5 mb-5">
                Quote Results
              </h1>
            </div>
            {loading ? (
              <Box
                sx={{
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : QuoteDetails ? (
              <DeliveredQuotePreviewClient data={QuoteDetails} />
            ) : (
              <div className="w-[95%] lg:w-[95%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="animate-pulse size-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p className="text-xl lg:text-2xl font-bold text-center">
                    Waiting for admin to send quote.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-center font-bold text-[22px]">
              Quote with Id: {(id && `${id} already bind requested`) || "N/A"}
            </h1>
          </>
        )}
      </div>
    </>
  );
};

export default PolicyQuoteResults;
