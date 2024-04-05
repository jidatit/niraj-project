import React from 'react'
import SideNav from './components/SideNav'
import StickyTitle from "./components/StickyTitle"
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <div className="fixed left-0 right-0 top-0 bottom-0 flex">
                <SideNav />
                <div className="w-full overflow-x-auto bg-[#FAFAFA]">
                    <div className="min-w-full md:min-w-[300px] lg:min-w-full">
                        <StickyTitle />
                        <div className='px-[50px] py-[50px]'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout