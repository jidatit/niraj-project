import React from 'react'
import c1 from "../../../assets/homepage/c1.png"

const ResourceCenter = ({item}) => {
    return (
        <>
            <div className="max-w-xl rounded overflow-hidden shadow-lg">
                <img className="w-full" src={item.img || c1} alt="Sunset in the mountains" />
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-[#D8F2FF] rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{item.topic_name || "Topic Name"}</span>
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{item.heading || "The Coldest Sunset"}</div>
                    <p className="text-gray-700 text-base">
                        {item.desc || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil."}
                    </p>
                </div>
            </div>
        </>
    )
}

export default ResourceCenter