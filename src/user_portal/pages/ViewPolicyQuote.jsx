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

const ViewPolicyQuote = () => {
    const [AllQuotes, setAllQuotes] = useState([]);
    const { currentUser } = useAuth()
    const [openModal, setopenModal] = useState(false);
    const [PopupData, setPopupData] = useState();

    const onClose = () => {
        setopenModal(false)
    }

    const handleOpenModalWithData = (data) => {
        setopenModal(true)
        setPopupData(data)
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


                            <div className='w-full border-r-[1px] group py-[30px] cursor-pointer rounded-md hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5'>
                                <img className='group-hover:animate-pulse' src={resicon} alt="" />
                                <p className='font-bold text-[16px] text-center'>Quote Results</p>
                            </div>


                            {PopupData && (<Link to={`/user_portal/pq_progress?type=${PopupData.policyType}&id=${PopupData.id}`}>
                                <div className='w-full group py-[30px] rounded-md cursor-pointer hover:bg-slate-50 transition-all ease-in-out delay-200 h-full flex flex-col justify-center items-center gap-5'>
                                    <img className='group-hover:animate-pulse' src={progicon} alt="" />
                                    <p className='font-bold text-[16px] text-center'>Quote Progress</p>
                                </div>
                            </Link>)}

                        </div>
                    </Slide>
                </Modal>

            </div>
        </>
    )
}

export default ViewPolicyQuote