import React, { useState } from 'react';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {

    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()
    const [showUnmatchedError, setShowUnmatchedError] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        cnewPassword: '',
        oldPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => {
            const updatedFormData = {
                ...prevState,
                [name]: value
            };

            setShowUnmatchedError(updatedFormData.newPassword !== updatedFormData.cnewPassword);

            return updatedFormData;
        });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!showUnmatchedError) {
            try {
                setLoader(true)
                const auth = getAuth();
                const user = auth.currentUser;
                const credential = EmailAuthProvider.credential(user.email, formData.oldPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, formData.newPassword);
                toast.success("Password updated successfully.");
                setTimeout(() => {
                    navigate("/user_portal")
                }, 2000);
            } catch (error) {
                console.error("Error updating password: ", error.message);
                toast.error("Error updating password: " + error.message);
            } finally {
                setLoader(false)
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-start w-full p-4">
            <ToastContainer />
            <div className="flex flex-col items-center justify-center w-full p-6 rounded-lg shadow-lg transition-all ease-in-out delay-100 md:w-[70%] lg:w-[70%] mt-8">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-center text-gray-900 md:text-3xl">
                    Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="flex flex-col w-full gap-4">
                    <TextField
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        color={'success'}
                        id="oldPassword"
                        placeholder="Old Password"
                        onChange={handleChange}
                        className="w-full"
                    />
                    <TextField
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        error={showUnmatchedError}
                        helperText={showUnmatchedError && "Passwords do not match"}
                        color={!showUnmatchedError ? 'success' : 'error'}
                        id="newPassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        className="w-full"
                    />
                    <TextField
                        type="password"
                        name="cnewPassword"
                        value={formData.cnewPassword}
                        error={showUnmatchedError}
                        helperText={showUnmatchedError && "Passwords do not match"}
                        color={!showUnmatchedError ? 'success' : 'error'}
                        id="cnewPassword"
                        placeholder="Confirm New Password"
                        onChange={handleChange}
                        className="w-full"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={showUnmatchedError}
                        className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        {loader ? <CircularProgress size={20} color='inherit' /> : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;