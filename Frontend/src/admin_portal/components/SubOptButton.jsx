import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const SubOptButton = ({ actionType }) => {
    const handleOptionClick = (action_data) => {
        actionType(action_data);
    };
    return (
        <>
            <button
                type="button"
                className="inline-flex outline-none justify-center items-center gap-1 rounded-md text-white shadow-sm px-4 py-2 bg-[#003049] text-sm font-medium"
                onClick={() => handleOptionClick('Words')}
            >
                Add Row to Table
                <AddIcon className={`mt-[2px] h-5 w-5`} />
            </button>
        </>
    );
};

export default SubOptButton;