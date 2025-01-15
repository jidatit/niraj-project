import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../AuthContext";
import { db } from "../../../db";
import { TextField } from "@mui/material";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    mailingAddress: "",
    signupType: "",
    zipCode: "",
    driversLicense: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setFormData(userDoc.data());
        } else {
          toast.error("User profile not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading profile data!");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, formData);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  const Loader = () => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 opacity-75 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" bg-gray-50 ">
        <div className=" mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Settings
          </h1>

          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <TextField
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full md:w-[60%]"
                  placeholder="Name of Person Being Referred"
                  required
                  disabled={loading}
                  fullWidth
                />
              </div>

              {/* Email Field */}
              <div>
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  fullWidth
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  fullWidth
                />
              </div>

              {/* Date of Birth Field */}
              <div>
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </div>

              {/* ZIP Code Field */}
              <div>
                <TextField
                  label="ZIP Code"
                  variant="outlined"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  fullWidth
                  inputProps={{ pattern: "[0-9]{5}" }}
                />
              </div>

              {/* Driver's License Field */}
              <div>
                <TextField
                  label="Driver's License"
                  variant="outlined"
                  name="driversLicense"
                  value={formData.driversLicense}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  fullWidth
                />
              </div>

              {/* Mailing Address Field */}
              <div className="md:col-span-2">
                <TextField
                  label="Mailing Address"
                  variant="outlined"
                  name="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  multiline
                  rows={3}
                  fullWidth
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#003049] text-white rounded-md hover:bg-[#002635] focus:outline-none focus:ring-2 focus:ring-[#002635] disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProfilePage;
