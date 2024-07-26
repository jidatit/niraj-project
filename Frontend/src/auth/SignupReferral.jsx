import React, { useState, useEffect } from 'react';
import logo from "../assets/newlogo.png";
import { Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { auth, db } from '../../db';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hasEmptyValue } from '../utils/helperSnippets';
import { CircularProgress } from '@mui/material';

const SignupReferral = () => {
    const [Loader, setLoader] = useState(false)
    const [userData, setUserData] = useState({
        name: '',
        mailingAddress: '',
        email: '',
        phoneNumber: '',
        occupation: '',
        password: '',
        confirmPassword: '',
        signupType: 'Referral'
    });
    const [isFocus, setIsFocus] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const occupations = [
        { value: 'Real Estate Agent', label: 'Real Estate Agent' },
        { value: 'Mortgage Broker', label: 'Mortgage Broker' },
        { value: 'Property Manager', label: 'Property Manager' },
        { value: 'Inspector', label: 'Inspector' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });

        if (name === 'confirmPassword' && userData.password !== value) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
        if (name === 'password' && userData.confirmPassword !== value) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const handleOccupationChange = (selectedOption) => {
        setUserData({ ...userData, occupation: selectedOption ? selectedOption.value : '' });
        // Only push new occupation to the list if it's not already included
        if (selectedOption && !occupations.find(o => o.value === selectedOption.value)) {
            occupations.push(selectedOption);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            setLoader(true)
            const { confirmPassword, password, ...userDataWithoutPasswords } = userData;
            if (confirmPassword !== password) {
                toast.error("Password Not Matched!");
                setLoader(false)
                return;
            }
            if (hasEmptyValue(userDataWithoutPasswords)) {
                toast.error("Fill all Fields!");
                setLoader(false)
                return;
            }
            const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            await setDoc(doc(db, "users", user.uid), userDataWithoutPasswords);
            setLoader(false)
            toast.success("User registered!");
        } catch (error) {
            toast.error(error.message);
            setLoader(false)
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const url_name = urlParams.get('name');
        const url_email = urlParams.get('email');
        const url_phoneNumber = urlParams.get('phoneNumber');

        setUserData(prevData => ({
            ...prevData,
            name: url_name || '',
            email: url_email || '',
            phoneNumber: url_phoneNumber || ''
        }));
    }, []);

    return (
        <>
            <div className='w-[80%] transition ease-in-out delay-100 md:w-[60%] mt-[30px] mb-[30px] flex flex-col gap-5 p-5 justify-center items-center rounded-md bg-white'>
                <img src={logo} className='mt-[30px]' alt="" />

                <h2 className="text-center text-[22px] md:text-[28px] mb-[10px] font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>

                <form onSubmit={handleSignup} className="w-full flex flex-col gap-4 md:w-[60%]">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                        value={userData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="text"
                        name="mailingAddress"
                        placeholder="Mailing Address"
                        className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                        value={userData.mailingAddress}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                        value={userData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="number"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />

                    <CreatableSelect
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                minHeight: '57px',
                            }),
                        }}
                        value={occupations.find(o => o.value === userData.occupation) || null}
                        onChange={handleOccupationChange}
                        isClearable={true}
                        className='w-full'
                        placeholder={!isFocus ? "Occupation" : "Add New Occupation"}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        options={occupations}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                        value={userData.password}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />

                    {passwordError && <p className="text-red-500">{passwordError}</p>}

                    <button
                        type="submit"
                        disabled={passwordError}
                        className={`bg-[#003049] ${passwordError && "bg-gray-400"} w-full text-[20px] font-bold text-white px-4 py-2 rounded-md`}
                    >
                        {Loader ? (
                            <CircularProgress size={20} color='inherit' />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                <div className="w-full md:w-[60%] flex flex-col justify-center items-end">
                    <Link to="/auth/login_referral">
                        <p className="md:text-[15px] text-[12px] hover:underline">Already a member?</p>
                    </Link>
                </div>

                <div className="w-full mb-[30px] md:w-[60%]">
                    <Link to="/auth/login_referral" className="block">
                        <button className="bg-[#D62828] w-full text-[20px] font-bold text-white px-4 py-2 rounded-md">Login</button>
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default SignupReferral;