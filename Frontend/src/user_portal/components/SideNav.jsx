import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LOGO from "../../assets/newlogo.png";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import {
  MdRequestQuote,
  MdPolicy,
  MdOutlineRequestQuote,
} from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import {
  FaFileAlt,
  FaQuoteRight,
  FaUserFriends,
  FaUserCircle,
} from "react-icons/fa";

const SideNav = ({ isClient }) => {
  const menus = [
    { name: "Back to website", link: "/", icon: FaFileAlt },
    {
      name: "View Policy or Quote",
      link: "/user_portal",
      icon: MdOutlineRequestQuote,
    },
    { name: "Request Quote", link: "/user_portal/requests", icon: FaFileAlt },
    {
      name: "Refer a Friend",
      link: "/user_portal/refer_friend",
      icon: FaUserFriends,
    },
    ...(isClient
      ? [{ name: "Profile", link: "/user_portal/profile", icon: FaUserCircle }]
      : []),
    { name: "Logout", link: "/user_portal/logout", icon: FiLogOut },
  ];

  const [open, setOpen] = useState(true);

  const location = useLocation();

  const updateScreenSize = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <section className="flex">
      <div
        className={` bg-[#003049] min-h-screen shadow-md ${
          open ? "w-68" : " w-14 lg:w-[75px]"
        } duration-500 text-gray-100 px-2 lg:px-4 py-1 sm:py-2 md:py-2 lg:py-4 xl:py-6 2xl:py-6`}
      >
        <div className="py-3 flex bg-white justify-center items-center">
          {open && (
            <img
              className="cursor-pointer unselectable w-[200px]"
              onClick={() => setOpen(!open)}
              src={LOGO}
              alt=""
            />
          )}
          <img
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
            src={LOGO}
            alt=""
            style={{ display: !open ? "block" : "none" }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={`group flex items-center text-base gap-2 font-poppins ${
                open && "py-2 pl-2 pr-4"
              } ${
                location.pathname === menu?.link
                  ? "bg-[rgba(112,127,221,0.1) text-[#ffffff] bg-[#484a55] rounded-md"
                  : "text-white"
              } hover:bg-[rgba(112,127,221,0.1)] hover:text-[#FFFFFF] rounded-md`}
            >
              <div className="p-2 lg:p-3 rounded-md text-[#ffffff]">
                {React.createElement(menu?.icon, { size: "20" })}
              </div>
              <h2
                style={{
                  transitionDelay: `${i + 2}00ms`,
                }}
                className={`whitespace-pre duration-200 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-poppins whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideNav;
