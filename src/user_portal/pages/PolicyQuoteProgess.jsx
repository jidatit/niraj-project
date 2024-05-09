import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import reqicon from "../../assets/dash/progress/req.png"
import progicon from "../../assets/dash/progress/prog.png"
import delicon from "../../assets/dash/progress/del.png"
import boundicon from "../../assets/dash/progress/bound.png"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../../db"
import { getDoc, doc } from 'firebase/firestore'
import { getType } from "../../utils/helperSnippets"

const PolicyQuoteProgess = () => {

    const location = useLocation();
    const [QuoteDetails, setQuoteDetails] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const IdParam = searchParams.get('id');
        const TypeParam = searchParams.get('type');
        const collectionRef = getType(TypeParam)
        getStatusUpdates(collectionRef, IdParam)
    }, [location.search])

    const getStatusUpdates = async (collection_type, id) => {
        try {
            const docRef = doc(db, collection_type, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let docdata = { ...docSnap.data(), id: docSnap.id }
                setQuoteDetails(docdata)
            }
        } catch (error) {
            toast.error("Error Fetching Status For Your Quote!")
        }
    }

    const currentStep = QuoteDetails && QuoteDetails.status_step && parseInt(QuoteDetails.status_step);

    const progressCardData = [
        { heading: "Quote Requested", image: reqicon, info: "Your Quote has been Successfully Requested" },
        { heading: "Quote in progress", image: progicon, info: "Your Quote is Currently in Progress" },
        { heading: "Quote delivered", image: delicon, info: "Your Quote has been Successfully Delivered" },
        { heading: "Binder Requested", image: reqicon, info: "Binder has been Successfully Requested" },
        { heading: "Policy bound", image: boundicon, info: "Policy Bound" }
    ];

    const filteredProgressCardData = progressCardData && progressCardData?.slice(0, currentStep + 1);

    const progressCards = filteredProgressCardData && filteredProgressCardData?.map((card, index) => (
        <ProgressCard key={index} heading={card.heading} image={card.image} info={card.info} />
    ));

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                {progressCards}
            </div>
        </>
    )
}

const ProgressCard = ({ heading, image, info }) => {
    return (
        <>
            <div className='w-full mt-[30px] mb-[30px] flex flex-col justify-center items-center gap-5'>
                <p className='text-start w-full px-2 md:px-20 lg:text-[28px] md:text-[23px] text-[18px] font-bold'>{heading || "Quote Requested"}</p>
                <div className="w-full md:w-[90%] rounded-md hover:bg-slate-50 transition-all ease-in-out delay-200 group px-2 md:px-20 bg-white shadow-md pt-10 pb-10 flex flex-col gap-10 justify-center items-center">
                    <img className='group-hover:animate-pulse' src={image || reqicon} alt="" />
                    <p className='font-semibold'>{info || "Your Quote has been Successfully Requested"}</p>
                </div>
            </div>
        </>
    )
}

export default PolicyQuoteProgess;
