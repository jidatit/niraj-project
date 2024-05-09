import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../../db"
import { getDocs, collection } from 'firebase/firestore'
import DeliveredQuotePreviewClient from '../components/DeliveredQuotePreviewClient';

const PolicyQuoteResults = () => {
    const location = useLocation();
    const [QuoteDetails, setQuoteDetails] = useState(null);
    const [id, setId] = useState("");
    const [alreadyBindreq, setalreadyBindreq] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const IdParam = searchParams.get('id');
        setId(IdParam)
        const fetchData = async () => {
            const alreadyRequested = await checkAlreadyQuoteRequested(IdParam);
            if (!alreadyRequested) {
                getQuoteRes(IdParam);
            }
        };

        fetchData();
    }, [location.search])

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
        }
    }

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
    }

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                {alreadyBindreq === false ? (
                    <>
                        <div className="w-[95%] flex flex-col gap-5 justify-center items-start">
                            <h1 className="text-black font-bold text-[25px] mt-5 mb-5">Quote Results</h1>
                        </div>

                        {QuoteDetails && QuoteDetails ?
                            (
                                <DeliveredQuotePreviewClient data={QuoteDetails} />
                            )
                            :
                            (
                                <div className='w-[95%] animate-pulse min-h-screen lg:w-[95%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md'></div>
                            )}
                    </>
                )
                    :
                    (
                        <>
                            <h1 className='text-center font-bold text-[22px]'>Quote with Id: {id && `${id} already bind requested` || "N/A"}</h1>
                        </>
                    )}

            </div>
        </>
    )
}

export default PolicyQuoteResults