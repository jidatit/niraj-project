import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { TextField, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useAuth } from "../../AuthContext";
import { db } from "../../../db";

// Define US states for dropdown
const usStates = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Helper functions for name handling
const getDisplayName = (user) => {
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  return user.name || 'Unknown';
};

const getFirstName = (user) => {
  if (user.firstName) return user.firstName;
  if (user.name) return user.name.split(' ')[0] || user.name;
  return '';
};

const getLastName = (user) => {
  if (user.lastName) return user.lastName;
  if (user.name) {
    const parts = user.name.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }
  return '';
};

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    mailingAddress: "",
    mailingCity: "",
    mailingState: "",
    signupType: "",
    zipCode: "",
    driversLicense: "",
  });

  useEffect(() => {
    if (currentUser?.data) {
      setFormData({
        name: currentUser?.data?.name || "",
        firstName: currentUser.data.firstName || "",
        lastName: currentUser.data.lastName || "",
        email: currentUser.data.email || "",
        phoneNumber: currentUser.data.phoneNumber || "",
        dateOfBirth: currentUser.data.dateOfBirth || "",
        mailingAddress: currentUser.data.mailingAddress || "",
        mailingCity: currentUser.data.mailingCity || "",
        mailingState: currentUser.data.mailingState || "",
        signupType: currentUser.data.signupType || "",
        zipCode: currentUser.data.zipCode || "",
        driversLicense: currentUser.data.driversLicense || "",
      });
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
      const computedName = `${formData.firstName} ${formData.lastName}`.trim();
      const userDataToSave = {
        ...formData,
        name: computedName, // Store combined name for compatibility
        nameInLower: computedName.toLowerCase(), // For search compatibility
      };
      await updateDoc(userRef, userDataToSave);

      // Update the currentUser state with new data
      setCurrentUser({
        ...currentUser,
        data: userDataToSave,
      });

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
      <div className="bg-gray-50">
        <div className="mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Settings
          </h1>

          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name (Read-Only) */}
              <div className="md:col-span-2">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  value={getDisplayName(formData)}
                  className="w-full"
                  disabled
                  fullWidth
                />
              </div>

              {/* First Name Field */}
              <div>
                <TextField
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your first name"
                  required
                  disabled={loading}
                  fullWidth
                />
              </div>

              {/* Last Name Field */}
              <div>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your last name"
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
                  label="Mailing Street Address"
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

              {/* Mailing City Field */}
              <div>
                <TextField
                  label="Mailing City"
                  variant="outlined"
                  name="mailingCity"
                  value={formData.mailingCity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  fullWidth
                  placeholder="Enter your mailing city"
                />
              </div>

              {/* Mailing State Field */}
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="mailingState-label">Mailing State</InputLabel>
                  <Select
                    labelId="mailingState-label"
                    label="Mailing State" // 👈 add this
                    name="mailingState"
                    value={formData.mailingState}
                    onChange={handleChange}
                    disabled={loading}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 224, width: 250 },
                      },
                    }}
                  >
                    {usStates.map((state) => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
    </>
  );
};

export default ProfilePage;