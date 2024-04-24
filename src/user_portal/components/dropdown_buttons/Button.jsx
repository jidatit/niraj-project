import React, { useState } from 'react';
import homeicon from "../../../assets/dash/home.png"

const Button = ({ items, onSelect }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white justify-center bg-[#003049] outline-none md:text-[24px] font-semibold rounded-lg text-sm px-5 py-4 text-center inline-flex items-center shadow-md transition duration-300 ease-in-out hover:bg-[#00213A]"
                type="button"
            >
                {selectedItem ? (
                    <>
                        <p>Policy Type: {selectedItem.value}</p>
                        <img src={selectedItem.img} alt={selectedItem.label} className="ml-2 w-6 h-6" />
                    </>
                ) : (
                    <>
                        <p>Policy Type: Home</p>
                        <img src={homeicon} className="ml-2 w-6 h-6" />
                    </>
                )}
                <svg
                    className={`w-4 h-4 ml-2 transition-transform transform ${isOpen ? 'rotate-180' : ''}`}
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
                <div className="absolute z-10 mt-1 w-full bg-white divide-y divide-gray-100 rounded-lg shadow">
                    {items.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => handleItemClick(item)}
                            className="flex flex-row gap-2 w-full text-[#003049] outline-none font-medium rounded-md text-sm px-5 py-2.5 text-start transition duration-300 ease-in-out hover:bg-[#E5E5E5] hover:text-white"
                        >
                            {item.label}
                            <img className='w-[24px] h-[24px]' src={item.img} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Button;
