import React from 'react'
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <>
            <div className='w-[80%] transition ease-in-out delay-100 md:w-[60%] mt-[30px] mb-[30px] flex flex-col gap-5 p-5 justify-center items-center rounded-md bg-white'>
                <img src={logo} className='mt-[30px]' alt="" />

                <h2 className="text-center text-[22px] md:text-[28px] mb-[10px] font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>

                <input type="text" id="Name" name="Name" placeholder="Name" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <input type="date" id="DateofBirth" name="DateofBirth" placeholder="Date of Birth" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <input type="text" id="MailingAddress" name="MailingAddress" placeholder="Mailing Address" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <input type="email" id="Email" name="Email" placeholder="Email" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <input type="number" id="PhoneNumber" name="PhoneNumber" placeholder="Phone Number" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <input type="password" id="pwd" name="pwd" placeholder="Password" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <input type="password" id="cpwd" name="cpwd" placeholder="Confirm Password" className="w-full md:w-[60%] border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500" />

                <button className="bg-[#003049] w-full md:w-[60%] text-[20px] font-bold text-white px-4 py-2 rounded-md">Register</button>

                <div className="w-full md:w-[60%] flex flex-col justify-center items-end">
                    <a href="#" className="md:text-[15px] text-[12px] hover:underline">Already a member?</a>
                </div>

                <div className="w-full mb-[30px] md:w-[60%]">
                    <Link to="/auth" className="block"><button className="bg-[#D62828] w-full text-[20px] font-bold text-white px-4 py-2 rounded-md">Login</button></Link>
                </div>

            </div>
        </>
    )
}

export default Signup