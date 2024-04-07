import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { auth, db } from '../../db';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [userData, setUserData] = useState({
        name: '',
        dateOfBirth: '',
        mailingAddress: '',
        email: '',
        phoneNumber: '',
        occupation: '',
        password: '',
        confirmPassword: '',
        signupType: ''
    });

    const [passwordError, setPasswordError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });

        if (name === 'confirmPassword' && userData.password !== value) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const handleOccupationChange = (selectedOption) => {
        setUserData({ ...userData, occupation: selectedOption });
    };

    const handleSignupTypeChange = (selectedOption) => {
        setUserData({ ...userData, signupType: selectedOption });
    };

    const handleSignup = async () => {
        try {
            const { confirmPassword, password, ...userDataWithoutPasswords } = userData;
            const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            await setDoc(doc(db, "users", user.uid), userDataWithoutPasswords);
            toast.success("User registered!");
        } catch (error) {
            toast.error('Error signing up');
        }
    };

    const occupations = [
        { value: 'Real Estate Agent', label: 'Real Estate Agent' },
        { value: 'Mortgage Broker', label: 'Mortgage Broker' },
        { value: 'Property Manager', label: 'Property Manager' },
        { value: 'Inspector', label: 'Inspector' },
    ]

    const signuptypes = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    return (
        <>
            <div className='w-[80%] transition ease-in-out delay-100 md:w-[60%] mt-[30px] mb-[30px] flex flex-col gap-5 p-5 justify-center items-center rounded-md bg-white'>
                <img src={logo} className='mt-[30px]' alt="" />

                <h2 className="text-center text-[22px] md:text-[28px] mb-[10px] font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>

                <input type="text" name="name" placeholder="Name" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.name} onChange={handleInputChange} />

                <input type="date" name="dateOfBirth" placeholder="Date of Birth" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.dateOfBirth} onChange={handleInputChange} />

                <input type="text" name="mailingAddress" placeholder="Mailing Address" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.mailingAddress} onChange={handleInputChange} />

                <input type="email" name="email" placeholder="Email" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.email} onChange={handleInputChange} />

                <input type="number" name="phoneNumber" placeholder="Phone Number" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.phoneNumber} onChange={handleInputChange} />

                <CreatableSelect styles={{
                    control: (provided, state) => ({
                        ...provided,
                        minHeight: '57px',
                    }),
                }} value={userData.occupation}
                    onChange={handleOccupationChange}
                    isClearable={true} className='w-full md:w-[60%]' placeholder="Occupation"
                    options={occupations} />

                <input type="password" name="password" placeholder="Password" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.password} onChange={handleInputChange} />

                <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" value={userData.confirmPassword} onChange={handleInputChange} />

                {passwordError && <p className="text-red-500">{passwordError}</p>}

                <Select styles={{
                    control: (provided, state) => ({
                        ...provided,
                        minHeight: '57px',
                    }),
                }} className='w-full md:w-[60%]' isClearable={true} value={userData.signupType} onChange={handleSignupTypeChange} placeholder="Sign up as client / referral partner" options={signuptypes} />

                <button className="bg-[#003049] w-full md:w-[60%] text-[20px] font-bold text-white px-4 py-2 rounded-md" onClick={handleSignup}>Register</button>

                <div className="w-full md:w-[60%] flex flex-col justify-center items-end">
                    <Link to="/auth"> <p className="md:text-[15px] text-[12px] hover:underline">Already a member?</p></Link>
                </div>

                <div className="w-full mb-[30px] md:w-[60%]">
                    <Link to="/auth" className="block"><button className="bg-[#D62828] w-full text-[20px] font-bold text-white px-4 py-2 rounded-md">Login</button></Link>
                </div>

            </div>
            <ToastContainer />
        </>
    )
}

export default Signup
