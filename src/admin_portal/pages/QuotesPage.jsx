import React, { useState, useEffect, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import papericon from "../../assets/dash/quotes/paper.png"
import boxicon from "../../assets/dash/quotes/box.png"
import tickicon from "../../assets/dash/quotes/tick.png"
import peopleicon from "../../assets/dash/quotes/people.png"
import historyicon from "../../assets/dash/quotes/history.png"
import { MaterialReactTable } from 'material-react-table';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../db';
import HomePolicyPreview from "./QuotePoliciesPreviews/HomePolicyPreview"
import AutoPolicyPreview from "./QuotePoliciesPreviews/AutoPolicyPreview"
import LiabilityPolicyPreview from "./QuotePoliciesPreviews/LiabilityPolicyPreview"
import FloodPolicyPreview from "./QuotePoliciesPreviews/FloodPolicyPreview"
import { Link } from 'react-router-dom';
import DeliveredQuotePreviewAdmin from '../components/DeliveredQuotePreviewAdmin';

const QuotesPage = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [openModal, setopenModal] = useState(false);
  const [popupValue, setPopupvalue] = useState(null);

  const handleModal = (data) => {
    setopenModal(true)
    setPopupvalue(data)
  }

  const handleModalClose = () => {
    setopenModal(false)
    setPopupvalue(null)
  }

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const [req_quotes, setReqQuotes] = useState([]);
  const [del_quotes, setDelQuotes] = useState([]);
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

  useEffect(() => {
    const getAllReqQuoteTypes = async () => {
      try {
        const homeQuotesCollection = collection(db, 'home_quotes');
        const autoQuotesCollection = collection(db, 'auto_quotes');
        const liabilityQuotesCollection = collection(db, 'liability_quotes');
        const floodQuotesCollection = collection(db, 'flood_quotes');

        const hqsnapshot = await getDocs(homeQuotesCollection);
        const aqsnapshot = await getDocs(autoQuotesCollection);
        const lqsnapshot = await getDocs(liabilityQuotesCollection);
        const fqsnapshot = await getDocs(floodQuotesCollection);

        const homeQuotesData = hqsnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const autoQuotesData = aqsnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const liabilityQuotesData = lqsnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const floodQuotesData = fqsnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const allQuotes = [...homeQuotesData, ...autoQuotesData, ...liabilityQuotesData, ...floodQuotesData];
        setReqQuotes(allQuotes);
      } catch (error) {
        toast.error("Error Fetching Requested Quotes!")
      }
    };
    const getAllDeliveredQuotes = async () => {
      try {
        const DeliveredQuotesCollection = collection(db, 'prep_quotes');
        const dqsnapshot = await getDocs(DeliveredQuotesCollection);
        const DeliveredQuotesData = dqsnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDelQuotes(DeliveredQuotesData)
      } catch (error) {
        toast.error("Error Fetching Delivered Quotes!")
      }
    }

    getAllDeliveredQuotes();
    getAllReqQuoteTypes();
  }, []);

  const req_columns = useMemo(
    () => [
      {
        accessorKey: 'user.name',
        header: 'Client',
        size: 100,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'user.phoneNumber',
        header: 'Client Contact no.',
        size: 200,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'user.email',
        header: 'Client Email',
        size: 100,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'policyType',
        header: 'Policy Type',
        size: 100,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => (
          <Box display="flex" justifyContent="center" alignItems="center" gap="5px">
            {cell.getValue() === "pending" ? (
              <>
                <div className='h-[5px] w-[5px] bg-[#ff0000] rounded-full'></div>
                <p className='text-center text-[12px]'>Pending</p>
              </>
            ) : (
              <>
                <div className='h-[5px] w-[5px] bg-[#00C32B] rounded-full'></div>
                <p className='text-center text-[12px]'>Completed</p>
              </>
            )}
          </Box>
        )
      },
      {
        header: 'Actions',
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => { handleViewPolicy(cell.row.original, cell.row.original.policyType) }}
              className='bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]'>
              View Form Details
            </button>

            <Link to={`/admin_portal/editor?qsr_type=${cell.row.original.policyType}&q_id=${cell.row.original.id}`} target="_blank">
              <button
                disabled={cell.row.original.status === "pending" ? true : false}
                className={`${cell.row.original.status === "pending" ? "bg-[#ADADAD]" : "bg-[#F77F00]"} font-bold rounded-[18px] px-[16px] py-[4px] text-white text-[10px]`}>
                Send Quote
              </button>
            </Link>

          </Box>
        ),
      },
    ],
    [],
  );

  const del_columns = useMemo(
    () => [
      {
        accessorKey: 'user.name',
        header: 'Client',
        size: 100,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'user.phoneNumber',
        header: 'Client Contact no.',
        size: 200,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'user.email',
        header: 'Client Email',
        size: 100,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        accessorKey: 'qsr_type',
        header: 'Policy Type',
        size: 100,
        Cell: ({ cell }) => (
          <Box >
            {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
          </Box>
        )
      },
      {
        header: 'Actions',
        size: 200,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center" gap="18px">
            <button
              onClick={() => handleModal(cell.row.original)}
              className='bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px]'>
              View Quote
            </button>
          </Box>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
        <ToastContainer />

        <div className="w-[90%] grid md:grid-cols-2 gap-5 grid-cols-1 lg:grid-cols-3 justify-center items-center">

          <div className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedButton === 'requestedQuotes' ? 'bg-[#003049] text-white' : ''}`} onClick={() => handleButtonClick('requestedQuotes')}>
            <div className='flex w-[60%] flex-col justify-center items-center lg:items-start gap-1'>
              <p className='lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white'>Requested Quotes</p>
              <p className='lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white'>You have 7 Quotes Requested</p>
            </div>
            <img src={papericon} alt="" />
          </div>

          <div className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedButton === 'deliveredQuotes' ? 'bg-[#003049] text-white' : ''}`} onClick={() => handleButtonClick('deliveredQuotes')}>
            <div className='flex w-[60%] flex-col justify-center items-center lg:items-start gap-1'>
              <p className='lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white'>Delivered Quotes</p>
              <p className='lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white'>7 Quotes have been successfully Delivered</p>
            </div>
            <img src={boxicon} alt="" />
          </div>

          <div className={`group hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedButton === 'binderRequested' ? 'bg-[#003049] text-white' : ''}`} onClick={() => handleButtonClick('binderRequested')}>
            <div className='flex w-[60%] flex-col justify-center items-center lg:items-start gap-1'>
              <p className='lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white'>Binder Requested</p>
              <p className='lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white'>7 Binder have been requested</p>
            </div>
            <img src={tickicon} alt="" />
          </div>

        </div>

        <div className="w-[90%] flex flex-col lg:flex-row gap-5 mt-[30px] justify-center items-center">

          <div className={`group w-full lg:w-[33%] hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedButton === 'policyBound' ? 'bg-[#003049] text-white' : ''}`} onClick={() => handleButtonClick('policyBound')}>
            <div className='flex w-[60%] flex-col justify-center items-center lg:items-start gap-1'>
              <p className='lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white'>Policy Bound</p>
              <p className='lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white'>7 policies have been bound</p>
            </div>
            <img src={peopleicon} alt="" />
          </div>

          <div className={`group w-full lg:w-[33%] hover:bg-[#003049] px-2 py-4 transition-all delay-75 cursor-pointer rounded-md shadow-md flex lg:flex-row gap-2 flex-col justify-center items-center ${selectedButton === 'policyHistory' ? 'bg-[#003049] text-white' : ''}`} onClick={() => handleButtonClick('policyHistory')}>
            <div className='flex w-[60%] flex-col justify-center items-center lg:items-start gap-1'>
              <p className='lg:text-[18px] lg:text-start text-center font-bold group-hover:text-white'>Policy History</p>
              <p className='lg:text-[14px] lg:w-[80%] lg:text-start text-center font-light group-hover:text-white'>52 Policies have been expired</p>
            </div>
            <img src={historyicon} alt="" />
          </div>

        </div>

        {selectedButton === "requestedQuotes" && (
          <div className='w-full flex flex-col justify-center items-center mt-[30px]'>
            {req_quotes && req_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable columns={req_columns} data={req_quotes} />
              </div>
            ) : (<p className='text-center mt-5'>No Quotes Found....</p>)}
          </div>)}

        {selectedButton === "deliveredQuotes" && (
          <div className='w-full flex flex-col justify-center items-center mt-[30px]'>
            {del_quotes && del_quotes.length > 0 ? (
              <div className="table w-full">
                <MaterialReactTable columns={del_columns} data={del_quotes} />
              </div>
            ) : (<p className='text-center mt-5'>No Quotes Found....</p>)}

            <DeliveredQuotePreviewAdmin data={popupValue} openModal={openModal} onClose={(handleModalClose)} />

          </div>)}

        {selectedPolicyType === "Home" && (
          <HomePolicyPreview data={selectedPolicyData} open={isModalOpen}
            handleClose={handleCloseModal} />
        )}
        {selectedPolicyType === "Auto" && (
          <AutoPolicyPreview data={selectedPolicyData} open={isModalOpen}
            handleClose={handleCloseModal} />
        )}
        {selectedPolicyType === "Liability" && (
          <LiabilityPolicyPreview data={selectedPolicyData} open={isModalOpen}
            handleClose={handleCloseModal} />
        )}
        {selectedPolicyType === "Flood" && (
          <FloodPolicyPreview data={selectedPolicyData} open={isModalOpen}
            handleClose={handleCloseModal} />
        )}

      </div>
    </>
  )
}

export default QuotesPage