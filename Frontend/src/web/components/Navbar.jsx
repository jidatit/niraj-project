import React, { useState, useRef, useEffect } from 'react';
import logo from "../../assets/newlogo.png";
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import DropdownMenu from './dropdown_button/button';

const LoaderButton = () => {
    return (
        <button className="animate-pulse bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-gray-400 font-semibold py-2 px-4 rounded-md">
            Loading...
        </button>
    )
}

const Navbar = () => {
    const { currentUser, signupType } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loaderB, setLoaderB] = useState(true);

    const menuRef = useRef(null);

    useEffect(() => {
        setLoaderB(true);
        const timer = setTimeout(() => {
            setLoaderB(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);


    return (
        <>
            <nav className="bg-white border-gray-200">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/"><img src={logo} className=" max-h-[70px] transform-scale-[1.3]" alt="Flowbite Logo" /></Link>
                    <button onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 mt-[-20px] justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-200" aria-controls="navbar-default" aria-expanded={isMenuOpen}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div ref={menuRef} className={`w-full transition-all ease-in-out delay-200 md:flex md:w-auto ${isMenuOpen ? "" : "hidden"}`} id="navbar-default">
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
                            {loaderB ? (
                                <LoaderButton />
                            ) : (
                                <>
                                    {currentUser && signupType === "admin" ? (
                                        <li>
                                            <Link to="/admin_portal">
                                                <button className='block py-2 px-6 md:mt-0 mt-1 rounded-[20px] bg-[#D62828] md:border-0 text-white'>Admin Portal</button>
                                            </Link>
                                        </li>
                                    ) : currentUser && signupType !== "admin" ? (
                                        <>
                                            <li>
                                                <Link to="/user_portal">
                                                    <button className='block py-2 px-6 md:mt-0 mt-1 rounded-[20px] bg-[#2ca960] md:border-0 text-white'>User Portal</button>
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <DropdownMenu L={true} />
                                            </li>
                                            <li>
                                                <DropdownMenu S={true} />
                                            </li>
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
