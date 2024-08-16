import React, { useEffect, useState, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table';
import Button from "./Button"
import { Modal, Slide, TextField, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../../db';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getType } from "../../utils/helperSnippets"
import { useAuth } from "../../AuthContext"
import { ClientQuoteBindMail } from '../../utils/mailingFuncs';
import { useNavigate } from 'react-router-dom';

const CustomTablePreviewClient = ({ qid, qsr_type, table2_data, user }) => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const [tableCols1, setTableCols1] = useState(null);

    const [openbindoptions, setopenbindoptions] = useState(false);
    const [SlideModal, setSlideModal] = useState(false);

    const [formData, setFormData] = useState({
        effective_date: '',
        isMortgageOrLienholder: '',  // only in Home, if yes then below values
        company_name: '',
        acc_loan_number: '',
        responsible_payment: '',
    });

    const onClose = () => {
        setSlideModal(false)
    }

    const table_columns_lia = useMemo(
        () => [
            {
                accessorKey: 'liability_coverage_amount',
                header: 'Liability Coverage Amount',
                size: 200,
            },
            {
                accessorKey: 'um_coverage',
                header: 'U/M Coverage',
                size: 150,
            },
            {
                accessorKey: 'cyber_liability',
                header: 'Cyber Liability',
                size: 150,
            },
            {
                accessorKey: 'identity_theft',
                header: 'Identity Theft',
                size: 150,
            },
        ],
        [],
    );
    const table_columns_flood = useMemo(
        () => [
            {
                accessorKey: 'dwelling',
                header: 'Dwelling',
                size: 200,
            },
            {
                accessorKey: 'personal_property',
                header: 'Personal Property',
                size: 150,
            },
        ],
        [],
    );
    const table_columns_auto = useMemo(
        () => [
            {
                accessorKey: 'bodily_injury',
                header: 'Bodily Injury',
                size: 200,
            },
            {
                accessorKey: 'property_damage',
                header: 'Property Damage',
                size: 150,
            },
            {
                accessorKey: 'um',
                header: 'U/M',
                size: 150,
            },
            {
                accessorKey: 'collision_deductible',
                header: 'Collision Deductible',
                size: 150,
            },
            {
                accessorKey: 'rental',
                header: 'Rental',
                size: 150,
            },
            {
                accessorKey: 'roadside',
                header: 'Roadside',
                size: 150,
            },
            {
                accessorKey: 'comprehensive_deductible',
                header: 'Comprehensive Deductible',
                size: 150,
            },
        ],
        [],
    );
    const table_columns_home = useMemo(
        () => [
            {
                accessorKey: 'dwelling',
                header: 'Dwelling',
                size: 150,
            },
            {
                accessorKey: 'other_structures',
                header: 'Other Structures',
                size: 150,
            },
            {
                accessorKey: 'contents',
                header: 'Contents',
                size: 150,
            },
            {
                accessorKey: 'loss_of_use',
                header: 'Loss of Use',
                size: 150,
            },
            {
                accessorKey: 'liability',
                header: 'Liability',
                size: 150,
            },
            {
                accessorKey: 'medical_payments',
                header: 'Medical Payments',
                size: 150,
            },
            {
                accessorKey: 'aop_deductible',
                header: 'AOP Deductible',
                size: 150,
            },
            {
                accessorKey: 'hurricane_deductible',
                header: 'Hurricane Deductible',
                size: 150,
            },
        ],
        [],
    );

    useEffect(() => {
        let columns;
        if (qsr_type.toLowerCase() === "liability") {
            columns = table_columns_lia;
        } else if (qsr_type.toLowerCase() === "auto") {
            columns = table_columns_auto;
        } else if (qsr_type.toLowerCase() === "flood") {
            columns = table_columns_flood;
        } else if (qsr_type.toLowerCase() === "home") {
            columns = table_columns_home;
        } else {
            columns = null;
        }
        setTableCols1(columns);
    }, [qsr_type]);

    const table_columns_2 = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                header: 'Carrier',
                size: 200,
            },
            {
                accessorKey: 'premium',
                header: 'Premium',
                size: 800,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue() == 0.00 ? "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations." : cell.getValue()}
                    </Box>
                )
            },
        ],
        [],
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [bindingDisable, setBindingDisable] = useState(false)

    const handleBindQuote = async () => {
        try {
            setBindingDisable(true)
            await addDoc(collection(db, 'bind_req_quotes'), { ...formData, qid, qsr_type, user: { ...user }, bound_status: "pending" });
            await updateStatusStep(qsr_type, qid)
            onClose()
            ClientQuoteBindMail(currentUser.data?.name, currentUser.data?.email, qsr_type)
            toast.success("Quote bind request with success!")
            setTimeout(() => {
                navigate("/user_portal/view_policy_quote")
            }, 2000);
        } catch (error) {
            toast.error("Error Requesting Bind Quote!")
        } finally {
            setBindingDisable(false)
        }
    }

    const updateStatusStep = async (type, id) => {
        try {
            let docdata = {}
            const collectionRef = getType(type)
            const docRef = doc(db, collectionRef, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                docdata = { ...docSnap.data(), id: docSnap.id }
            }
            await updateDoc(docRef, {
                status_step: "3"
            });
        } catch (error) {
            toast.error("Error updating status!")
        }
    }

    return (
        <>
            <div className="w-full flex mt-[20px] flex-col justify-center items-start">
                <ToastContainer />
                {table_columns_2 && table2_data && (<div className="w-full">
                    <MaterialReactTable
                        columns={table_columns_2}
                        data={table2_data}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        enableTableHead={false}
                    />
                </div>)}

                <div className="w-full mb-5 flex flex-col justify-end items-end">
                    <div className="md:w-[30%] relative mt-[30px] mb-[30px] w-full">
                        <Button onClickProp={() => setopenbindoptions(!openbindoptions)} text={"BIND"} icon={true} />
                        {openbindoptions &&
                            (<div className='absolute mt-1 divide-y divide-solid w-full rounded-md bg-[#e0e0e0]'>
                                {table2_data && table2_data?.map((row, index) => (
                                    <div key={index} onClick={() => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            carrier: row.carrier
                                        }));
                                        setSlideModal(true);
                                    }} className='w-full hover:bg-slate-200 rounded-md cursor-pointer pl-[20px] py-2 flex flex-col justify-center items-start'>
                                        <p className='font-semibold'>{row.carrier}</p>
                                    </div>
                                ))}
                            </div>)}
                    </div>
                </div>

                <Modal
                    open={SlideModal}
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
                        in={SlideModal}
                        mountOnEnter
                        unmountOnExit
                        style={{ transition: "transform 2s ease-in-out" }}
                    >

                        <div className='w-[95%] overflow-y-auto max-h-[80vh] lg:w-[50%] p-10 lg:p-20 bg-white flex flex-col justify-start items-center rounded-lg shadow-md'>

                            {qsr_type && (<div className='w-full flex flex-col justify-center items-center md:items-start'>
                                <h1 className='lg:text-[32px] md:text-start text-center font-bold md:text-[24px] text-[18px]'>Fill out Form for {qsr_type} Quote</h1>
                            </div>)}

                            <div className='w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start'>
                                <p className='lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]'>Confirm the effective date of the policy</p>
                                <TextField
                                    className='w-full'
                                    id="effective_date"
                                    type='date'
                                    value={formData.effective_date}
                                    onChange={(e) => handleChange(e)}
                                    name="effective_date"
                                />
                            </div>

                            {qsr_type && qsr_type.toLowerCase() === "home" && (
                                <>
                                    <div className='w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start'>
                                        <p className='lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]'> Is there a mortgage or lienholder?</p>
                                        <FormControl className='w-full' variant="outlined">
                                            <InputLabel id="binary-select1">Yes / No</InputLabel>
                                            <Select
                                                labelId="binary-select-label"
                                                id="binary-select1"
                                                value={formData.isMortgageOrLienholder}
                                                onChange={(e) => handleChange(e)}
                                                label="Yes / No"
                                                name="isMortgageOrLienholder"
                                            >
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    {formData.isMortgageOrLienholder === "yes" && (
                                        <>
                                            <div className='w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start'>
                                                <p className='lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]'>Name of the Company</p>
                                                <TextField
                                                    className='w-full'
                                                    id="company_name"
                                                    type='text'
                                                    value={formData.company_name}
                                                    onChange={(e) => handleChange(e)}
                                                    name="company_name"
                                                />
                                            </div>
                                            <div className='w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start'>
                                                <p className='lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]'>Account / Loan number</p>
                                                <TextField
                                                    className='w-full'
                                                    id="acc_loan_number"
                                                    type='text'
                                                    value={formData.acc_loan_number}
                                                    onChange={(e) => handleChange(e)}
                                                    name="acc_loan_number"
                                                />
                                            </div>
                                            <div className='w-full flex mt-[20px] mb-[20px] gap-2 flex-col justify-center items-start'>
                                                <p className='lg:text-[22px] md:text-start text-center font-semibold md:text-[18px] text-[13px]'>Who is responsible for payment?</p>
                                                <FormControl className='w-full' variant="outlined">
                                                    <InputLabel id="binary-select1">Insured / Mortgage</InputLabel>
                                                    <Select
                                                        labelId="binary-select-label"
                                                        id="binary-select1"
                                                        value={formData.responsible_payment}
                                                        onChange={(e) => handleChange(e)}
                                                        label="Insured / Mortgage"
                                                        name="responsible_payment"
                                                    >
                                                        <MenuItem value="Insured">Insured</MenuItem>
                                                        <MenuItem value="Mortgage">Mortgage</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            <div className='w-full flex flex-col justify-end items-end'>
                                <div className="md:w-[30%] relative mt-[30px] mb-[30px] w-full">
                                    <Button isDisabled={bindingDisable} onClickProp={handleBindQuote} text={"Submit"} />
                                </div>
                            </div>

                        </div>

                    </Slide>
                </Modal>


            </div >
        </>
    )
}

export default CustomTablePreviewClient