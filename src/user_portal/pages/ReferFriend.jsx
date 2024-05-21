import { TextField } from '@mui/material';
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../components/Button"
import emailjs from '@emailjs/browser';

const ReferFriend = () => {
    const [ButtonText, setButtonText] = useState("Confirm");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        dob: '',
        mailingAddress: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendEmail = (event) => {

        event.preventDefault();

        const name_fi = document.getElementById('name').value;
        const email_fi = document.getElementById('email').value;
        const phoneNumber_fi = document.getElementById('phoneNumber').value;
        const dob_fi = document.getElementById('dob').value;
        const mailingAddress_fi = document.getElementById('mailingAddress').value;

        if (!name_fi || !email_fi || !phoneNumber_fi || !mailingAddress_fi) {
            setButtonText("Fill out first!")
            return;
        }

        const templateParams = {
            from_name: "FL Insurance Hub",
            name: name_fi,
            email: email_fi,
            phoneNumber: phoneNumber_fi,
            dob: dob_fi,
            mailingAddress: mailingAddress_fi,
            link: `${import.meta.env.VITE_BUTTON_LINK}`
        };
        setButtonText('Confirming...');
        emailjs
            .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_REFER_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_KEY)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setButtonText('Confirm');
                toast.success('Invite Successfully Sent!');
            })
            .catch((err) => {
                console.log('FAILED...', err);
                setButtonText('Error, Try again!');
            });
        setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            dob: '',
            mailingAddress: '',
        });
    }

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                <div className='w-full p-5 mt-[30px] shadow-lg rounded-lg bg-white mb-[30px] flex flex-col justify-center items-center gap-5'>
                    <h1 className='font-bold text-2xl text-center'>Fill out Form for Referring a Friend</h1>
                    <div className='w-full flex flex-col gap-3 justify-center items-center mt-[30px]'>
                        <TextField onChange={handleChange} id='name' name='name' className='w-full md:w-[60%]' placeholder='Name of Person Being Referred' />
                        <TextField onChange={handleChange} id='email' name='email' type='email' className='w-full md:w-[60%]' placeholder='Email of Person Being Referred' />
                        <TextField onChange={handleChange} id='phoneNumber' name='phoneNumber' className='w-full md:w-[60%]' placeholder='Phone Number of Person Being Referred' />
                        <TextField onChange={handleChange} id='dob' name='dob' className='w-full md:w-[60%]' placeholder='DOB of Person Being Referred' />
                        <TextField onChange={handleChange} id='mailingAddress' name='mailingAddress' multiline rows={3} className='w-full md:w-[60%]' placeholder='Mailing Address of Person Being Referred' />
                    </div>

                    <div className="w-[90%] mb-5 flex flex-col justify-end items-end">
                        <div className="md:w-[30%] w-full pr-0 md:pr-2">
                            <Button onClickProp={sendEmail} text={ButtonText} iconArrow={true} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ReferFriend