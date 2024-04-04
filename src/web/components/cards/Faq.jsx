import React, { useState } from 'react';
import arrowIcon from '../../../assets/homepage/arrow.png';

const Faq = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="faq-card bg-[#F0FAFF] min-h-[80px] rounded-md mb-4 overflow-hidden">
            <div className={`faq-header flex items-center justify-between p-4 cursor-pointer ${isOpen ? 'bg-[#F0FAFF]' : 'bg-[#F0FAFF]'}`} onClick={toggleAccordion}>
                <h3 className="faq-question text-lg font-semibold">{props.ques || "Maecenas nec odio et ante tincidunt tempus?"}</h3>
                <img src={arrowIcon} className={`arrow-icon transition-all duration-100 w-6 h-6 transform ${isOpen ? 'rotate-180' : ''}`} alt="Arrow" />
            </div>
            <div className={`faq-content transition-all duration-300 ${isOpen ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4">
                    <p className="faq-answer">{props.ans || "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."}</p>
                </div>
            </div>
        </div>
    );
};

export default Faq;