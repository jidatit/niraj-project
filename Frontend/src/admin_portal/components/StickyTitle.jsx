import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function StickyTitle() {
  const { currentUser } = useAuth()
  return (
    <>
      <div className="flex-grow text-gray-800">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
          {/* <div className="relative w-full max-w-md sm:-ml-2"> */}
            {/* <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="absolute h-6 w-6 mt-2.5 ml-2 text-gray-400">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input type="text" role="search" placeholder="Search..." className="py-2 outline-none pl-10 pr-4 w-full border-4 border-transparent placeholder-gray-400 focus:bg-gray-50 rounded-lg" /> */}
          {/* </div> */}
          <div className="flex flex-shrink-0 items-center ml-auto">
            <button className="inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg">
              <span className="sr-only">User Menu</span>

              <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
                {currentUser.data ? (
                  <>
                    <span className="font-semibold">{currentUser.data.name || "Grace Simmons"}</span>
                    {currentUser.data?.occupation && (<span className="text-sm text-gray-600">
                      {currentUser.data?.occupation ? currentUser.data.occupation : (
                        <div className="bg-transparent rounded-lg w-[150px] shadow-md pt-1 pb-1 pl-2 animate-pulse">
                          <div className="w-[90%] h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="w-[90%] h-2 bg-gray-300 rounded mb-2"></div>
                        </div>
                      )}
                    </span>)}
                  </>
                ) : (
                  <div className="bg-white flex flex-col justify-center items-center rounded-lg w-[150px] shadow-md pt-1 pb-1 animate-pulse">
                    <div className="w-[90%] h-4 bg-gray-300 rounded"></div>
                  </div>
                )}
              </div>

              {/* <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="user profile photo" className="h-full w-full object-cover" />
              </span> */}
              {/* <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="hidden sm:block h-6 w-6 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg> */}
            </button>
            <div className="border-l pl-3 ml-3 space-x-1">
              {/* <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
                <span className="sr-only">Notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
                <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full animate-ping"></span>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button> */}
              <Link to="/admin_portal/logout">
                <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
                  <span className="sr-only">Log out</span>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

export default StickyTitle;
