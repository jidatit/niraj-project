import React, { useState } from 'react';
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="bg-white border-gray-200">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/"><img src={logo} className="w-[221px] h-[139px]" alt="Flowbite Logo" /></Link>
                    <button onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 mt-[-20px] justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-200" aria-controls="navbar-default" aria-expanded={isMenuOpen}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className={`w-full md:flex md:w-auto ${isMenuOpen ? "" : "hidden"}`} id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:flex-row lg:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                            <li>
                                <Link to="/"> <p className="block py-2 px-2 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-black">Home</p></Link>
                            </li>
                            <li>
                                <Link to="/resource-center"> <p className="block py-2 px-2 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-black">Resource Center</p></Link>
                            </li>
                            <li>
                                <Link> <p className="block py-2 px-2 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 text-black">Testimonials</p></Link>
                            </li>
                            <li>
                                <Link to="/auth"><button className='block py-2 px-6 md:mt-0 mt-1 md:mr-1 rounded-[20px] bg-[#003049] md:border-0 text-white'>Log In</button></Link>
                            </li>
                            <li>
                                <Link to="/auth/signup"><button className='block py-2 px-6 md:mt-0 mt-1 rounded-[20px] bg-[#D62828] md:border-0 text-white'>Sign Up</button></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
