import React from 'react';
import c1 from "../../../assets/homepage/c1.png";

const ResourceCenter = ({ item }) => {
    return (
        <>
            <div className="max-w-xl rounded overflow-hidden shadow-lg h-[400px]">
                <img className="w-full h-48 object-cover" src={item.MainImageUrl || c1} alt="Sunset in the mountains" />
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-[#D8F2FF] rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{item.topic || "Topic Name"}</span>
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{item.title || "The Coldest Sunset"}</div>
                    <p className="text-gray-700 text-base overflow-hidden" style={{ maxHeight: '100px' }}>
                        {item.preview_text || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil."}
                    </p>
                </div>
            </div>
        </>
    )
}

export default ResourceCenter;
