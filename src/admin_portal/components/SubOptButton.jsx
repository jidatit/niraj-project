import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';

const SubOptButton = ({ actionType }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (action_data) => {
        actionType(action_data)
    }
    return (
        <>
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="inline-flex outline-none justify-center items-center gap-1 w-full rounded-md text-white shadow-sm px-4 py-2 bg-[#003049] text-sm font-medium"
                    onClick={toggleDropdown}
                >
                    Add Row to Table
                    <AddIcon className={`${isOpen ? "rotate-180 transition-all ease-in-out delay-150" : ""} mt-[2px] h-5 w-5`} />
                </button>

                {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="py-1" role="none">
                            <button
                                onClick={() => handleOptionClick('Add Numbers Row')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                            >
                                Add Numbers Row
                            </button>
                            <button
                                onClick={() => handleOptionClick('Add Words Row')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                            >
                                Add Words Row
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default SubOptButton