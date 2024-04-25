import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import plusicon from "../../../assets/dash/plus.png"
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const HomeForm = () => {

    const [fileModal, setfileModal] = useState(false);

    const [formData, setFormData] = useState({
        address: '',
        mailing: false,
        ishomebuild: "",
        newPurchase: "",
        newPurchaseDate: "",
        currentInsurance: "",
        expiryDate: "",
        persons: [{ name: '', dob: '' }]
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddPerson = () => {
        setFormData((prevData) => ({
            ...prevData,
            persons: [...prevData.persons, { name: '', dob: '' }]
        }));
    };

    const handlePersonChange = (index, field, value) => {
        const updatedPersons = [...formData.persons];
        updatedPersons[index][field] = value;
        setFormData((prevData) => ({
            ...prevData,
            persons: updatedPersons
        }));
    };

    return (
        <>
            <div className='w-full flex flex-col justify-center items-center gap-5'>
                <div className='w-full flex flex-col justify-center items-start'>
                    <h1 className='font-bold lg:text-[25px]'>Fill out Form for Home Quote</h1>
                </div>

                {formData.persons.map((person, index) => (
                    <div key={index} className='w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                        <div className='flex w-full flex-col justify-center items-start gap-2'>
                            <InputLabel htmlFor={`name-${index}`}>Name to be Insured</InputLabel>
                            <TextField
                                className='w-full'
                                id={`name-${index}`}
                                label="Type your name here......"
                                variant="outlined"
                                value={person.name}
                                onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                            />
                        </div>
                        <div className='flex w-full flex-col justify-center items-start gap-2'>
                            <InputLabel htmlFor={`date-${index}`}>Date of Birth</InputLabel>
                            <TextField
                                className='w-full'
                                id={`date-${index}`}
                                type='date'
                                value={person.dob}
                                onChange={(e) => handlePersonChange(index, 'dob', e.target.value)}
                            />
                        </div>
                    </div>
                ))}


                <div className='w-full flex flex-col justify-center items-center'>
                    <button onClick={handleAddPerson} className='bg-[#F77F00] w-full text-white py-3 font-semibold rounded-md outline-none px-3 md:[80%] lg:w-[40%] flex flex-row justify-center items-center gap-2'>
                        <img src={plusicon} alt="" /> <span className='text-[12px] md:text-[16px]'>Add Another Person</span>
                    </button>
                </div>

                <div className='w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                    <div className='flex w-full flex-col justify-center items-start gap-2'>
                        <InputLabel htmlFor="address">Address to be insured</InputLabel>
                        <TextField value={formData.address}
                            onChange={(e) => handleChange(e)} name="address" className='w-full' id="address" label="Type your Address here......" variant="outlined" />
                    </div>
                    <div className='flex w-full flex-row pt-5 gap-2 justify-start items-center'>
                        <input value={formData.mailing} checked={formData.mailing} name="mailing"
                            onChange={(e) => handleChange(e)} className='w-[20px] h-[20px]' type="checkbox" id="mailing" />
                        <InputLabel htmlFor="mailing">Same as Mailing Address</InputLabel>
                    </div>
                </div>


                <div className='w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                    <div className='flex w-full flex-col justify-center items-start gap-2'>
                        <InputLabel htmlFor="binary-select1">Is this home built before 2005?</InputLabel>
                        <FormControl className='w-full' variant="outlined">
                            <InputLabel id="binary-select1">Yes / No</InputLabel>
                            <Select
                                labelId="binary-select-label"
                                id="binary-select1"
                                value={formData.ishomebuild}
                                onChange={(e) => handleChange(e)}
                                label="Yes / No"
                                name="ishomebuild"
                            >
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className='flex w-full flex-col gap-2 justify-center items-start'>
                        <InputLabel htmlFor="binary-select2">New Purchase?</InputLabel>
                        <FormControl className='w-full' variant="outlined">
                            <InputLabel id="binary-select2">Yes / No</InputLabel>
                            <Select
                                labelId="binary-select-label"
                                id="binary-select2"
                                value={formData.newPurchase}
                                onChange={(e) => handleChange(e)}
                                label="Yes / No"
                                name="newPurchase"
                            >
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>


                <div className='w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                    {formData.ishomebuild === "yes" && (
                        <div className='flex w-full flex-col justify-center items-start gap-2'>
                            <button
                                onClick={() => setfileModal(true)}
                                className="bg-white border-[1px] border-black text-black font-extralight w-full py-2 px-4 rounded"
                            >
                                + Upload Inspections
                            </button>
                        </div>
                    )}
                    {formData.newPurchase === "yes" && (<div className='flex w-full flex-col justify-center items-start gap-2'>
                        <TextField
                            className='w-full'
                            id="newPurchaseDate"
                            type='date'
                            value={formData.newPurchaseDate}
                            onChange={(e) => handleChange(e)}
                            name="newPurchaseDate"
                        />
                    </div>)}
                    {formData.newPurchase === "no" && (
                        <div className='flex w-full flex-col gap-2 justify-center items-start'>
                            <InputLabel htmlFor="binary-select3">Insurance Currently in place?</InputLabel>
                            <FormControl className='w-full' variant="outlined">
                                <InputLabel id="binary-select3">Yes / No</InputLabel>
                                <Select
                                    labelId="binary-select-label"
                                    id="binary-select3"
                                    value={formData.currentInsurance}
                                    onChange={(e) => handleChange(e)}
                                    label="Yes / No"
                                    name="currentInsurance"
                                >
                                    <MenuItem value="yes">Yes</MenuItem>
                                    <MenuItem value="no">No</MenuItem>
                                </Select>
                            </FormControl>
                        </div>)}
                </div>

                {formData.newPurchase === "no" && formData.currentInsurance === "yes" && (
                    <div className='w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                        <div className='flex w-full flex-col justify-center items-start gap-2'>
                            <TextField
                                className='w-full'
                                id="expiryDate"
                                type='date'
                                value={formData.expiryDate}
                                onChange={(e) => handleChange(e)}
                                name="expiryDate"
                            />
                        </div>
                    </div>)}

                <div className='w-full flex lg:flex-row gap-5 lg:gap-20 flex-col justify-center lg:justify-end items-center'>
                    <button className='px-5 bg-[#17A600] flex flex-row justify-center items-center gap-2 py-3 rounded-md font-bold text-[22px] text-white'>
                        <span>Submit</span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>

                <Modal
                    open={fileModal}
                    onClose={() => setfileModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="w-[90%] md:w-[30%]" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <label for="uploadFile1"
                            className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
                                <path
                                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                    data-original="#000000" />
                                <path
                                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                    data-original="#000000" />
                            </svg>
                            Upload file

                            <input type="file" id='uploadFile1' className="hidden" />
                            <p className="text-xs text-center px-2 font-medium text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                        </label>
                    </Box>
                </Modal>

            </div>
        </>
    )
}

export default HomeForm