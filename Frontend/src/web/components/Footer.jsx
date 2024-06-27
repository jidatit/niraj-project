import React from 'react'
import logo from "../../assets/newlogo.png"

const Footer = () => {
  return (
    <>
      <footer className="bg-[#003049] flex flex-col justify-center items-center h-[436px] py-6">
        <div className="container text-white mx-auto flex flex-col gap-6 justify-center items-center">
          <div className="mb-4 gap-5 flex flex-col justify-center items-center md:mb-0">
            <img className='w-[60%] md:w-[50%]' src={logo} alt="" />
            <ul className="flex justify-center">
              <li className="mr-4"><a className='md:text-[20px] underline font-semibold text-[17px]' href="#">Home</a></li>
              <li className="mr-4"><a className='md:text-[20px] underline font-semibold text-[17px]' href="#">Free Quote</a></li>
              <li><a className='md:text-[20px] underline font-semibold text-[17px]' href="#">Register</a></li>
            </ul>
          </div>
          <p className='md:text-[20px] underline font-semibold text-[17px]'>johngaltagency@email.com</p>
          <p className="text-center pl-2 pr-2 md:text-right">&copy; 2024 by JOHNGALT THAKER INSURANCE BRANCH. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer