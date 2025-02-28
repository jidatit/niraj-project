import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function bigButton({ R, GFQ, text }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} className={`relative ${GFQ && "z-[30]"} inline-block text-left`}>
            <button
                onClick={toggleDropdown}
                type="button"
                className={`${isOpen && "w-[250px]"} text-[18px] md:text-[24px] font-semibold py-2 px-6 md:mt-0 text-center inline-flex items-center mt-1 md:mr-1 
    ${isOpen ? 'rounded-t-[20px]' : 'rounded-[20px]'}
    ${GFQ ? "bg-[#003049]" : "bg-[#D62828]"} md:border-0 text-white`}
            >
                {text}
                <svg
                    className={`w-2.5 transition-all ease-in-out delay-150 h-2.5 ms-3 ${isOpen ? 'transform rotate-180' : ''}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>
            {isOpen && (
                <div
                    className={`origin-top-right absolute left-0 right-0 ${isOpen && "w-[250px]"}
               ${isOpen ? 'rounded-b-[20px]' : ''}
               shadow-lg bg-white divide-y divide-black dark:bg-[#F1F1F1]`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdownDefaultButton"
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {GFQ && (
                            <>
                                <li className="border-b border-black">
                                    <Link to="/auth/login_referral"><p className="block px-4 py-2 text-black">
                                        Log In as Referral
                                    </p></Link>
                                </li>
                                <li>
                                    <Link to="/auth"><p className="block px-4 py-2 text-black">
                                        Log In as Client
                                    </p></Link>
                                </li>
                            </>
                        )}
                        {R && (
                            <>
                                <li className="border-b border-black">
                                    <Link to="/auth/signup_referral"><p className="block px-4 py-2 text-black">
                                        Sign up as Referral
                                    </p></Link>
                                </li>
                                <li>
                                    <Link to="/auth/signup_client"><p className="block px-4 py-2 text-black">
                                        Sign up as Client
                                    </p></Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default bigButton;
