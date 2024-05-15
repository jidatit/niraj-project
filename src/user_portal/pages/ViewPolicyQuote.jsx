import React, { useState, useEffect, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../db';
import { Modal, Slide, Box } from "@mui/material"
import resicon from "../../assets/dash/modal/res.png"
import progicon from "../../assets/dash/modal/prog.png"
import { Link } from 'react-router-dom';
import { useAuth } from "../../AuthContext"
import { toast } from 'react-toastify';
import img1 from "../../assets/dash/user/1.png"
import img2 from "../../assets/dash/user/2.png"
import img3 from "../../assets/dash/user/3.png"
import img4 from "../../assets/dash/user/4.png"

const ViewPolicyQuote = () => {
    const [AllQuotes, setAllQuotes] = useState([]);
    const { currentUser } = useAuth()
    const [openModal, setopenModal] = useState(false);
    const [PopupData, setPopupData] = useState();
    const [openModalPolicy, setopenModalPolicy] = useState(false);
    const [PopupDataPolicy, setPopupDataPolicy] = useState();

    const onClose = () => {
        setopenModal(false)
    }

    const onClosePolicy = () => {
        setopenModalPolicy(false)
    }

    const handleOpenModalWithData = (data) => {
        setopenModal(true)
        setPopupData(data)
    }

    const handleOpenModalWithDataPolicy = (data) => {
        setopenModalPolicy(true)
        setPopupDataPolicy(data)
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'policyType',
                header: 'Quote Type',
                size: 100,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                    </Box>
                )
            },
            {
                accessorKey: 'user.mailingAddress',
                header: 'Quote Address',
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
                            onClick={() => { handleOpenModalWithDataPolicy(cell.row.original) }}
                            className='bg-[#F77F00] rounded-[18px] px-[16px] py-[4px] text-white text-[10px] lg:text-[14px] lg:font-bold'>
                            View Policy
                        </button>
                        <button
                            onClick={() => { handleOpenModalWithData(cell.row.original) }}
                            className='bg-[#003049] rounded-[18px] px-[16px] py-[4px] text-white text-[10px] lg:text-[14px] lg:font-bold'>
                            View Quote
                        </button>
                    </Box>)
            }
        ],
        [],
    );

    useEffect(() => {
        const getUserQuotes = async () => {
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

                let filteredhomeQuotesData = currentUser && homeQuotesData && homeQuotesData?.filter(obj => obj.user.id === currentUser.uid);
                let filteredautoQuotesData = currentUser && autoQuotesData && autoQuotesData?.filter(obj => obj.user.id === currentUser.uid);
                let filteredliabilityQuotesData = currentUser && liabilityQuotesData && liabilityQuotesData?.filter(obj => obj.user.id === currentUser.uid);
                let filteredfloodQuotesData = currentUser && floodQuotesData && floodQuotesData?.filter(obj => obj.user.id === currentUser.uid);

                const allQts = [...filteredhomeQuotesData, ...filteredautoQuotesData, ...filteredliabilityQuotesData, ...filteredfloodQuotesData];

                setAllQuotes(allQts)
            } catch (error) {
                toast.error("Error fetching quotes!")
            }
        }
        getUserQuotes()
    }, []);

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">

                {AllQuotes && (<div className="table w-full">
                    <MaterialReactTable
                        columns={columns}
                        data={AllQuotes} />
                </div>)}

                <Modal
                    open={openModal}
                    onClose={onClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Slide
                        direction="right"
                        in={openModal}
                        mountOnEnter
                        unmountOnExit
                        style={{ transition: "transform 2s ease-in-out" }}
                    >
                        <div className="lg:w-[30%] w-[90%] bg-white grid grid-cols-2 justify-center rounded-md shadow-lg items-center">

                            {PopupData && (<Link to={`/user_portal/pq_results?type=${PopupData.policyType}&id=${PopupData.id}`} target='_blank'>
                                <div className='w-full border-r-[1px] group py-[30px] cursor-pointer rounded-md hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5'>
                                    <img className='group-hover:animate-pulse' src={resicon} alt="" />
                                    <p className='font-bold text-[16px] text-center'>Quote Results</p>
                                </div>
                            </Link>)}

                            {PopupData && (<Link to={`/user_portal/pq_progress?type=${PopupData.policyType}&id=${PopupData.id}`} target='_blank'>
                                <div className='w-full group py-[30px] rounded-md cursor-pointer hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5'>
                                    <img className='group-hover:animate-pulse' src={progicon} alt="" />
                                    <p className='font-bold text-[16px] text-center'>Quote Progress</p>
                                </div>
                            </Link>)}

                        </div>
                    </Slide>
                </Modal>

                <Modal
                    open={openModalPolicy}
                    onClose={onClosePolicy}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                                <DropdownPolicy data={PopupDataPolicy} />
                            )}

                        </div>
                    </Slide>
                </Modal>

            </div>
        </>
    )
}


const DropdownPolicy = ({ data }) => {
    return (
        <>
            <div className='w-full flex-col justify-center items-center rounded-md'>
                <div className='w-full flex flex-col justify-center rounded-t-md items-center py-2 bg-[#003049] text-white'>
                    <p className='text-center font-semibold text-[24px]'>Select your action</p>
                </div>
                <div className="divide-y divide-solid">
                    <div className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>View Coverage</p>
                        <img className='w-[24px] h-[24px]' src={img1} alt="" />
                    </div>
                    <div className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>Change Coverage</p>
                        <img className='w-[24px] h-[24px]' src={img2} alt="" />
                    </div>
                    <div className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>Premium History</p>
                        <img className='w-[24px] h-[24px]' src={img3} alt="" />
                    </div>
                    <div className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>Cancel Policy</p>
                        <img className='w-[24px] h-[24px]' src={img4} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPolicyQuote