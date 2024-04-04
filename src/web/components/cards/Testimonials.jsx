import React from 'react'
import userpic from "../../../assets/homepage/user.png"

const Testimonials = () => {
    return (
        <>
            <div className="max-w-lg mx-auto bg-[#F0FAFF] border-[#9DDEFF] border-[1px] rounded-xl overflow-hidden shadow-lg">
                <div className="flex items-center p-4">
                    <img className="w-12 h-12 rounded-full mr-4" src={userpic} alt="User Image" />
                    <div>
                        <p className="text-lg md:text-xl lg:text-2xl font-bold">Alex Allan</p>
                        <p className="text-sm font-semibold md:text-base text-gray-600">Ceo, Consultancy Company</p>
                    </div>
                </div>
                <div className="ml-3 mr-3 bg-gradient-to-r from-[#006397] via-green-400 to-[#D62828] h-1"></div>
                <div className="p-4">
                    <p className="text-start text-sm md:text-base lg:text-lg">{"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu."}</p>
                </div>
            </div>
        </>
    )
}

export default Testimonials