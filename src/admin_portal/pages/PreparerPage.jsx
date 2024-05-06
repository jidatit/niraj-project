import React, { useEffect, useState, useMemo } from 'react';
import { TextField, Box } from '@mui/material';
import Button from '../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../db';
import Modal from '@mui/material/Modal';
import { MaterialReactTable } from 'material-react-table';

const PreparerPage = () => {
    const [preparers, setPreparers] = useState([]);
    const [buttonText, setButtonText] = useState("Create");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchPreparers = async () => {
            try {
                const preparersCollection = collection(db, 'preparers');
                const snapshot = await getDocs(preparersCollection);
                const preparersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPreparers(preparersData);
            } catch (error) {
                console.error('Error fetching preparers:', error);
            }
        };

        fetchPreparers();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_1: '',
        phone_2: '',
        company_name: '',
        company_address: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const addpreparertodb = async () => {
        try {
            if (!formData.name || !formData.email) {
                toast.warn("Fill Details")
                return
            }
            setButtonText("Creating");
            await addDoc(collection(db, 'preparers'), formData);
            toast.success('Preparer added successfully!');
            setButtonText("Create");
        } catch (error) {
            toast.error('Error occurred');
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Preparer Name',
                size: 100,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                    </Box>
                )
            },
            {
                accessorKey: 'email',
                header: 'Preparer Email',
                size: 100,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                    </Box>
                )
            },
            {
                accessorKey: 'phone_1',
                header: 'Preparer Phone 1',
                size: 200,
            },
            {
                accessorKey: 'phone_2',
                header: 'Preparer Phone 2',
                size: 200,
            },
        ],
        [],
    );

    const DeletePreparer = async (id) => {
        try {
            await deleteDoc(doc(db, 'preparers', id));
            toast.success('Preparer deleted successfully!');
            setPreparers(prevPreparers => prevPreparers.filter(prep => prep.id !== id));
        } catch (error) {
            console.error('Error deleting preparer:', error);
            toast.error('Error occurred while deleting preparer');
        }
    }

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
                    <button className="md:w-[30%] font-semibold md:font-bold rounded-[33px] bg-[#003049] text-white text-[15px] lg:text-[22px] py-2 md:px-3 px-2 md:py-4" onClick={handleOpen}>Create a New Preparer +</button>
                    <h1 className="text-black font-bold text-[25px] mt-5 mb-5">Previously Added Preparers</h1>
                </div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="md:w-[50%] w-[90%] gap-4 bg-white flex flex-col  rounded-md shadow-lg overflow-y-auto max-h-[80vh] items-center py-[30px]">
                        <h3 className='font-bold md:text-[24px] text-[15px] text-center'>Create a New Preparer</h3>
                        <TextField required label="Enter Preparer Name" type="text" onChange={handleChange} name="name" value={formData.name} className="w-[70%]" />
                        <TextField required label="Enter Preparer Email" type="email" onChange={handleChange} name="email" value={formData.email} className="w-[70%]" />
                        <TextField required label="Preparer Phone 1" type="text" onChange={handleChange} name="phone_1" value={formData.phone_1} className="w-[70%]" />
                        <TextField required label="Preparer Phone 2" type="text" onChange={handleChange} name="phone_2" value={formData.phone_2} className="w-[70%]" />
                        <TextField required label="Company Name" type="text" onChange={handleChange} name="company_name" value={formData.company_name} className="w-[70%]" />
                        <TextField required label="Company Address" type="text" multiline rows={5} onChange={handleChange} name="company_address" value={formData.company_address} className="w-[70%]" />

                        <div className="w-[90%] mb-5 flex flex-col justify-end items-end">
                            <div className="md:w-[30%] w-full pr-0 md:pr-2">
                                <Button onClickProp={addpreparertodb} text={buttonText} />
                            </div>
                        </div>
                    </div>
                </Modal>

                <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
                    {preparers ? (<div className="table w-full">
                        <MaterialReactTable
                            enableRowSelection
                            columns={columns}
                            data={preparers}
                            renderTopToolbarCustomActions={({ table }) => {
                                const handleDelete = () => {
                                    const selectedRows = table.getSelectedRowModel().flatRows;
                                    if (selectedRows.length === 1) {
                                        const selectedRowId = selectedRows[0].original.id;
                                        alert('Deleting Preparer with ID: ' + selectedRowId);
                                        DeletePreparer(selectedRowId)
                                    } else {
                                        alert('Please select a single row to delete.');
                                    }
                                }
                                return (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            color="error"
                                            disabled={!table.getIsSomeRowsSelected()}
                                            onClick={handleDelete}
                                            className='bg-[#003049] text-white rounded-lg py-2 px-6'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )
                            }}

                        />
                    </div>) : (null)}
                </div>

            </div>
        </>
    );
};

export default PreparerPage;
