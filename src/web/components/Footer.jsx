import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="bg-[#003049] flex flex-col justify-center items-center h-[436px] py-6">
        <div className="container text-white mx-auto flex flex-col gap-6 justify-center items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-[30px] font-bold text-[20px]">John Galt Thaker Insurance Branch</p>
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