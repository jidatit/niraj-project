import React from 'react'
import SideNav from './components/SideNav'
import StickyTitle from "./components/StickyTitle"
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const Loader = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 opacity-75 z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
};

const Layout = () => {
    const { currentUser, loading, signupType } = useAuth();

    if (loading) {
        return <Loader />;
    }

    return (
        currentUser && signupType !== "admin" ? (<>
            <div className="fixed left-0 right-0 top-0 bottom-0 flex">
                <SideNav />
                <div className="w-full overflow-x-auto bg-[#FAFAFA]">
                    <div className="min-w-full md:min-w-[300px] lg:min-w-full">
                        <StickyTitle />
                        <div className='px-[10px] py-[10px] md:px-[50px] md:py-[50px]'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>) : (
            <Navigate to="/" />
        )
    )
}

export default Layout