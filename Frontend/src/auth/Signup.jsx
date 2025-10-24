import React, { useState } from "react";
import logo from "../assets/newlogo.png";
import { Link } from "react-router-dom";
import { auth, db } from "../../db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hasEmptyValue } from "../utils/helperSnippets";
import { CircularProgress } from "@mui/material";

const Signup = () => {
  const [Loader, setLoader] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    mailingAddress: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    signupType: "Client",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "confirmPassword" && userData.password !== value) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoader(true);
      const {
        confirmPassword,
        password,
        dateOfBirth,
        firstName,
        lastName,
        ...userDataWithoutPasswords
      } = userData;

      if (confirmPassword !== password) {
        toast.error("Password Not Matched!");
        setLoader(false);
        return;
      }
      if (hasEmptyValue({ firstName, lastName, ...userDataWithoutPasswords })) {
        toast.error("Fill all Fields!");
        setLoader(false);
        return;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Compute name and nameInLower for compatibility
      const computedName = `${firstName} ${lastName}`.trim();
      const userDataToSave = {
        ...userDataWithoutPasswords,
        firstName,
        lastName,
        name: computedName, // Store combined name for existing code
        nameInLower: computedName.toLowerCase(), // For search compatibility
      };

      await setDoc(doc(db, "users", user.uid), userDataToSave);
      setLoader(false);
      toast.success("User registered!");
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };
  return (
    <>
      <div className="w-[80%] transition ease-in-out delay-100 md:w-[60%] mt-[30px] mb-[30px] flex flex-col gap-5 p-5 justify-center items-center rounded-md bg-white">
        <img src={logo} className="mt-[30px]" alt="" />

        <h2 className="text-center text-[22px] md:text-[28px] mb-[10px] font-bold leading-9 tracking-tight text-gray-900">
          Sign up
        </h2>

        <form
          onSubmit={handleSignup}
          className="w-full flex flex-col gap-4 md:w-[60%]"
        >
          <div className="w-full grid grid-cols-1 mt-[20px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
            <div className="flex w-full flex-col justify-center items-start gap-2">
              <label htmlFor="firstName" className="text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                value={userData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex w-full flex-col justify-center items-start gap-2">
              <label htmlFor="lastName" className="text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
                value={userData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="w-full relative">
            <input
              type="date"
              name="dateOfBirth"
              className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
              value={userData.dateOfBirth}
              onChange={handleInputChange}
            />
            <span className="absolute top-[50%] right-12 transform -translate-y-1/2 text-gray-400 text-sm">
              (Optional)
            </span>
          </div>

          <input
            type="text"
            name="mailingAddress"
            placeholder="Mailing Address"
            className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
            value={userData.mailingAddress}
            onChange={handleInputChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
            value={userData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
            value={userData.phoneNumber}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
            value={userData.password}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full border-gray-300 border rounded-md px-4 py-4 focus:outline-none focus:border-blue-500"
            value={userData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          {passwordError && <p className="text-red-500">{passwordError}</p>}

          <button
            type="submit"
            disabled={passwordError}
            className={`bg-[#003049] ${passwordError && "bg-gray-400"
              } w-full text-[20px] font-bold text-white px-4 py-2 rounded-md`}
          >
            {Loader ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="w-full md:w-[60%] flex flex-col justify-center items-end">
          <Link to="/auth">
            <p className="md:text-[15px] text-[12px] hover:underline">
              Already a member?
            </p>
          </Link>
        </div>

        <div className="w-full mb-[30px] md:w-[60%]">
          <Link to="/auth" className="block">
            <button className="bg-[#D62828] w-full text-[20px] font-bold text-white px-4 py-2 rounded-md">
              Login
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
