import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='w-full min-h-screen flex flex-col justify-center items-center bg-[#003049]'>
            <Outlet />
        </div>
    )
}

export default Layout