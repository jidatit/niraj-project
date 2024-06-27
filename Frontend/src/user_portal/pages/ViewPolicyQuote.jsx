import React, { useState, useEffect, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../db';
import { Modal, Slide, Box, TextField } from "@mui/material"
import resicon from "../../assets/dash/modal/res.png"
import progicon from "../../assets/dash/modal/prog.png"
import { Link } from 'react-router-dom';
import { useAuth } from "../../AuthContext"
import { ToastContainer, toast } from 'react-toastify';
import img1 from "../../assets/dash/user/1.png"
import img2 from "../../assets/dash/user/2.png"
import img3 from "../../assets/dash/user/3.png"
import img4 from "../../assets/dash/user/4.png"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from "../components/Button"
import LineGraph from '../components/LineGraph';
import { ClientQuotePolicyCancelMail, ClientQuotePolicyChangeMail } from '../../utils/mailingFuncs';

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
                        {cell.getValue() && cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                    </Box>
                )
            },
            {
                header: 'Actions',
                size: 200,
                Cell: ({ cell }) => (
                    <Box display="flex" alignItems="center" gap="18px">
                        <button
                            disabled={cell.row.original.status_step === "4" ? false : true}
                            onClick={() => { handleOpenModalWithDataPolicy(cell.row.original) }}
                            className={` ${cell.row.original.status_step !== "4" ? 'bg-[#d2ccc4]' : 'bg-[#F77F00]'} rounded-[18px] px-[16px] py-[4px] text-white text-[10px] lg:text-[14px] lg:font-bold`}>
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
                                <DropdownPolicy popup_data={PopupDataPolicy} />
                            )}

                        </div>
                    </Slide>
                </Modal>

            </div>
        </>
    )
}

const DropdownPolicy = ({ popup_data }) => {

    // const years = [2018, 2019, 2020, 2021, 2022];
    // const premiumPrices1 = [100, 120, 130, 125, 140];
    // const premiumPrices2 = [90, 110, 125, 115, 130];
    const { currentUser } = useAuth()
    const [policyData, setPolicyData] = useState(null);
    const [prepData, setPrepData] = useState(null);
    const [changeData, setchangeData] = useState(null);
    const [viewModal, setviewModal] = useState(false);
    const [changeModal, setchangeModal] = useState(false);
    const [viewModalData, setviewModalData] = useState([]);
    const [changesAnswer, setchangesAnswer] = useState("");
    const [cancelModal, setcancelModal] = useState(false);
    const [cancelModalData, setcancelModalData] = useState(null);
    const [premiumHistoryModal, setpremiumHistoryModal] = useState(false);
    const [premiumHistoryModalData, setpremiumHistoryModalData] = useState(null);

    const viewPremiumHistoryModal = (data) => {
        setpremiumHistoryModal(true)
        setpremiumHistoryModalData(data)
    }

    const closePremiumHistoryModal = () => {
        setpremiumHistoryModal(false)
        setpremiumHistoryModalData(null)
    }

    const viewCancelModal = (data) => {
        setcancelModalData(data)
        setcancelModal(true)
    }

    const closecancelModal = () => {
        setcancelModalData(null)
        setcancelModal(false)
    }

    const changeCoverage = (data) => {
        setchangeModal(true)
        setchangeData(data)
    }

    const closechangeModal = () => {
        setchangeModal(false)
        setchangeData(null)
    }

    const viewCoverage = (data) => {
        setviewModal(true)
        setviewModalData({ ...data, ...popup_data })
    }

    const closeviewModal = () => {
        setviewModal(false)
        setviewModalData(null)
    }

    const getPolicyData = async () => {
        try {
            const collec = collection(db, 'bound_policies');
            const snapshot = await getDocs(collec);
            const policiesData = snapshot.docs.map(doc => ({ policy_id: doc.id, ...doc.data() }));
            const filteredPolicyData = policiesData.find(policy => policy.qid === popup_data.id);
            setPolicyData(filteredPolicyData);
        } catch (error) {
            console.error('Error fetching policy data:', error);
        }
    };

    const getPreparedQuoteData = async () => {
        try {
            const collec = collection(db, 'prep_quotes');
            const snapshot = await getDocs(collec);
            const prepData = snapshot.docs.map(doc => ({ prep_quote_id: doc.id, ...doc.data() }));
            const filteredPrepData = prepData.find(prep => prep.q_id === popup_data.id);
            setPrepData(filteredPrepData.tablesData.table_1);
        } catch (error) {
            console.error('Error fetching prepared quote data:', error);
        }
    };

    useEffect(() => {
        getPolicyData();
        getPreparedQuoteData();
    }, [popup_data.id]);

    const [showChangeCoverageOptions, setShowChangeCoverageOptions] = useState(false);

    const handleToggleChangeCoverageOptions = () => {
        setShowChangeCoverageOptions(!showChangeCoverageOptions);
    };

    const handlechangePolicy = async () => {
        try {
            const data = { ...changeData, changesAnswer }
            await addDoc(collection(db, 'policy_changes'), data);
            ClientQuotePolicyChangeMail(currentUser.data?.name, currentUser.data?.email, changeData.qsr_type)
            closechangeModal()
            closeviewModal()
            toast.success("Changes submitted!")
        } catch (error) {
            console.log("Error changing policy!")
            toast.error("Error submitting changes!")
        }
    }

    const handlecancelPolicy = async () => {
        try {
            const data = { ...cancelModalData, type: "cancel" }
            await addDoc(collection(db, 'cancel_policies'), data);
            ClientQuotePolicyCancelMail(currentUser.data?.name, currentUser.data?.email, cancelModalData.qsr_type)
            closecancelModal()
            closeviewModal()
            toast.success("Cancel request submitted!")
        } catch (error) {
            console.log("Error cancelling policy!")
            toast.error("Error cancelling changes!")
        }
    }

    return (
        <>
            <div className='w-full flex-col justify-center items-center rounded-md'>
                <ToastContainer />
                <div className='w-full flex flex-col justify-center rounded-t-md items-center py-4 bg-[#003049] text-white'>
                    <p className='text-center font-semibold text-[24px]'>Select your action</p>
                </div>
                <div className="divide-y divide-solid">

                    <div onClick={() => viewCoverage(policyData)} className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>View Coverage</p>
                        <img className='w-[24px] h-[24px]' src={img1} alt="" />
                    </div>

                    <div className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4' onClick={handleToggleChangeCoverageOptions}>
                        {showChangeCoverageOptions && (
                            <div className="checkbox-wrapper-56">
                                <label className="container">
                                    <input defaultChecked type="checkbox" />
                                    <div className="checkmark"></div>
                                </label>
                            </div>
                        )}
                        <p className='text-[17px] font-semibold'>Change Coverage</p>
                        <img className='w-[24px] h-[24px]' src={img2} alt="" />
                    </div>

                    <div onClick={() => viewPremiumHistoryModal(policyData)} className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>Premium History</p>
                        <img className='w-[24px] h-[24px]' src={img3} alt="" />
                    </div>

                    <div onClick={() => viewCancelModal(policyData)} className='w-full flex cursor-pointer hover:bg-gray-200 flex-row gap-2 justify-center items-center py-4'>
                        <p className='text-[17px] font-semibold'>Cancel Policy</p>
                        <img className='w-[24px] h-[24px]' src={img4} alt="" />
                    </div>

                    {showChangeCoverageOptions && (
                        <>
                            <div onClick={() => changeCoverage(policyData)} className='w-full flex cursor-pointer bg-[#17A600] hover:bg-[#559e4a] flex-row gap-2 justify-center text-white items-center py-4'>
                                <p className='text-[17px] font-semibold'>Confirm</p>
                                <ArrowForwardIcon />
                            </div>
                        </>
                    )}
                </div>

                {viewModalData && (
                    <Modal
                        open={viewModal}
                        onClose={closeviewModal}
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
                            in={viewModal}
                            mountOnEnter
                            unmountOnExit
                            style={{ transition: "transform 2s ease-in-out" }}
                        >
                            <div className='w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md gap-y-10'>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    {viewModalData.company_name && (<p><span className='font-medium'>Company Name: </span>{viewModalData.company_name || "Name of the company"}</p>)}
                                    <p><span className='font-medium'>Effective Dates: </span>{`${viewModalData.bound_date} - ${viewModalData.effective_date}` || "Dates From - To"}</p>
                                    <p><span className='font-medium'>Policy Number: </span>{viewModalData.policy_id || "Policy Id"}</p>
                                    <p><span className='font-medium'>Policy Type: </span>{viewModalData.qsr_type || "Policy Type"}</p>
                                </div>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    {viewModalData.persons && viewModalData.persons?.map((person, index) => (
                                        <p key={index}><span className='font-medium'>Name Insured: </span>{person.name || "Name of the Insured Person"}</p>
                                    ))}
                                </div>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    <p><span className='font-medium'>Property Insured: </span>{viewModalData.address ? viewModalData.address : viewModalData.garaging_address
                                        || "Name of the company"}</p>
                                </div>

                                {prepData && (<div className='w-full flex flex-col justify-center items-start'>
                                    <p className='font-medium'>Coverage: </p>
                                    <div className='w-full flex flex-col justify-center items-start'>
                                        {prepData?.map((item, index) => (
                                            <div key={index} className='w-full flex flex-col text-[16px] font-normal justify-start items-start gap-1'>
                                                {Object.keys(item).map((key) => (
                                                    key !== 'id' &&
                                                    <p key={key}>
                                                        <span className='font-medium'>{key}: </span>
                                                        {item[key]}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>)}

                                <div className='w-full flex flex-col justify-center items-start'>
                                    <p className='font-medium'>Deductibles: </p>
                                    <p><span className='font-medium'>AOP: </span>{"“AOP deductible”"}</p>
                                    <p><span className='font-medium'>Wind/ Hurricane: </span>{"“Wind/ hurricane deductible”"}</p>
                                </div>

                                <div className='w-full flex flex-col justify-center items-start'>
                                    <p><span className='font-medium'>Premium: </span>{"“Premium Amount”"}</p>
                                </div>

                            </div>
                        </Slide>
                    </Modal>)}

                {changeData && (
                    <Modal
                        open={changeModal}
                        onClose={closechangeModal}
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
                            in={changeModal}
                            mountOnEnter
                            unmountOnExit
                            style={{ transition: "transform 2s ease-in-out" }}
                        >
                            <div className='w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md gap-y-10'>
                                <div className='w-full flex flex-col gap-5 justify-center items-start'>
                                    <h2 className='font-semibold'>Description of the changes required</h2>
                                    <TextField onChange={(e) => setchangesAnswer(e.target.value)} placeholder='Type your answer here......' className='w-full' multiline minRows={10} />
                                </div>
                                <div className='w-full flex flex-col justify-center items-end'>
                                    <Button text="Send" onClickProp={handlechangePolicy} icon={false} />
                                </div>
                            </div>
                        </Slide>
                    </Modal>)}

                {cancelModalData && (
                    <Modal
                        open={cancelModal}
                        onClose={closecancelModal}
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
                            in={cancelModal}
                            mountOnEnter
                            unmountOnExit
                            style={{ transition: "transform 2s ease-in-out" }}
                        >
                            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
                                <div className='w-[654px] h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center bg-white'>
                                    <p className='font-bold text-black text-3xl text-center'>Are you sure you want to cancel your Policy?</p>
                                    <div className='w-[540px] h-[70px] flex flex-row gap-6 justify-center'>
                                        <button onClick={closecancelModal} className='bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white'>Cancel</button>
                                        <button onClick={handlecancelPolicy} className='bg-[#059C4B] rounded-md w-[229px] h-[56px] font-bold text-white'>Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </Slide>
                    </Modal>)}

                {premiumHistoryModalData && (
                    <Modal
                        open={premiumHistoryModal}
                        onClose={closePremiumHistoryModal}
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
                            in={premiumHistoryModal}
                            mountOnEnter
                            unmountOnExit
                            style={{ transition: "transform 2s ease-in-out" }}
                        >
                            <div className='w-[95%] overflow-y-auto max-h-[90vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md gap-y-10'>
                                <LineGraph
                                // years={years}
                                // premiumPrices1={premiumPrices1}
                                // premiumPrices2={premiumPrices2}
                                />
                            </div>
                        </Slide>
                    </Modal>)}

            </div>
        </>
    )
}

export default ViewPolicyQuote