import React, { useState } from 'react';
import logo from "../assets/newlogo.png";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../db';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CircularProgress } from '@mui/material';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [Loader, setLoader] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            setLoader(true)
            const q = query(collection(db, "admins"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                await signInWithEmailAndPassword(auth, email, password);
                setError(""); // Clear any previous errors
                setLoader(false)
            } else {
                setLoader(false)
                setError("You are not authorized to access this page. An Admin with these credentials not found!");
            }
        } catch (error) {
            console.log(error);
            setError("Failed to log in. Please check your credentials and try again.");
            setLoader(false)
        }
    }

    return (
        <>
            <div className="min-h-screen w-full flex flex-col items-center justify-center py-6 px-4">
                <div className="md:w-[40%] w-[90%] border py-8 px-6 rounded border-gray-300 bg-white">
                    <img src={logo} alt="logo" className='w-40 mb-10' />

                    <h2 className="text-center text-3xl font-extrabold">
                        Admin Login
                    </h2>
                    <form onSubmit={handleLogin} className="mt-10 space-y-4">
                        <div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-blue-500"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-blue-500"
                                placeholder="Password"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

                        <div className="!mt-10">
                            <button
                                type="submit"
                                className="w-full py-2.5 px-4 text-sm rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                {Loader ? (
                                    <CircularProgress size={20} color='inherit' />
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}

export default AdminLogin;