import React from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-200 opacity-75">
      <div className="w-32 h-32 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
  );
};

const Layout = () => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <Loader />;
  }
  return !currentUser ? (
    <>
      <div className="w-full relative min-h-screen flex flex-col justify-center items-center bg-[#003049]">
        <Link to="/">
          <button className="absolute text-white rounded-full bg-white/20 shadow-lg isolate backdrop-blur-3xl px-3 py-3 transition-all ease-in-out delay-100 hover:pr-[50px] hover:ring-2 left-[50px] top-[20px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        </Link>
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default Layout;
