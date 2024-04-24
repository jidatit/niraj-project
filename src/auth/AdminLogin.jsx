import React, { useState } from 'react'
import logo from "../assets/newlogo.png"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../db';

const AdminLogin = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error)
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
                    <div className="mt-10 space-y-4">
                        <div>
                            <input value={email} onChange={(e) => setemail(e.target.value)} name="email" type="email" autocomplete="email" required className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-blue-500" placeholder="Email address" />
                        </div>
                        <div>
                            <input value={password} onChange={(e) => setpassword(e.target.value)} name="password" type="password" autocomplete="current-password" required className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-blue-500" placeholder="Password" />
                        </div>

                        <div className="!mt-10">
                            <button onClick={handleLogin} type="button" className="w-full py-2.5 px-4 text-sm rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminLogin