import React, { useState } from 'react';
import logo from "../assets/newlogo.png";
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../db';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CircularProgress } from '@mui/material';

const LoginReferral = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [Loader, setLoader] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            setLoader(true)
            const q = query(
                collection(db, "users"),
                where("email", "==", email),
                where("signupType", "==", "Referral")
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                await signInWithEmailAndPassword(auth, email, password);
                setError(""); // Clear any previous errors
                setLoader(false)
            } else {
                setLoader(false)
                setError("You are not authorized to access this page. A referral client with these credentials not found!");
            }
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError("Failed to log in. Please check your credentials and try again.");
            setLoader(false)
        }
    };

    return (
        <div className='w-[80%] transition ease-in-out delay-100 mt-[30px] mb-[30px] md:w-[60%] flex flex-col gap-5 p-5 justify-center items-center rounded-md bg-white'>
            <img src={logo} className='mt-[30px]' alt="" />

            <h2 className="text-center text-[22px] md:text-[28px] mb-[10px] font-bold leading-9 tracking-tight text-gray-900">Login</h2>

            <form onSubmit={handleLogin} className="w-full md:w-[60%] flex flex-col gap-4">
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

                <button
                    type="submit"
                    className="bg-[#003049] w-full text-[20px] font-bold text-white px-4 py-2 rounded-md"
                >
                    {Loader ? (
                        <CircularProgress size={20} color='inherit' />
                    ) : (
                        "Log in"
                    )}
                </button>

                <div className="w-full flex flex-col items-end">
                    <Link to="/auth/signup_referral">
                        <p className="md:text-[15px] text-[12px] hover:underline">Not a member?</p>
                    </Link>
                </div>

                <div className="w-full">
                    <Link to="/auth/signup_referral" className="block">
                        <button className="bg-[#D62828] w-full text-[20px] font-bold text-white px-4 py-2 rounded-md">
                            Sign up
                        </button>
                    </Link>
                </div>

            </form>
        </div>
    );
}

export default LoginReferral;