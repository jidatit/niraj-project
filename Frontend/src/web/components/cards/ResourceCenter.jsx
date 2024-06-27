import React from 'react';
import c1 from "../../../assets/homepage/c1.png";
import { strTruncator } from 'strtoolkit';

const ResourceCenter = ({ item }) => {
    return (
        <div className="max-w-xl rounded shadow-lg md:min-h-[620px]">
            <img className="w-full h-[387px] object-cover" src={item.MainImageUrl || c1} alt="Sunset in the mountains" />
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-[#D8F2FF] rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{strTruncator(item.topic,10) || "Topic Name"}</span>
            </div>
            <div className="px-6 py-2 pb-[20px]">
                <div className="font-bold text-xl mb-2">{strTruncator(item.title,35) || "The Coldest Sunset"}</div>
                <p className="text-gray-700 md:block hidden text-base overflow-hidden md:max-h-20" style={{ maxHeight: '100px' }}>
                    {strTruncator(item.preview_text,600) || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil."}
                </p>
                <p className="text-gray-700 md:hidden block text-base overflow-hidden md:max-h-20" style={{ maxHeight: '100px' }}>
                    {strTruncator(item.preview_text,100) || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil."}
                </p>
            </div>
        </div>
    )
}

export default ResourceCenter;
