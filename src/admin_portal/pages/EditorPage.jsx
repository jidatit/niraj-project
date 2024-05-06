import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import SubOptButton from '../components/SubOptButton';
import CustomTable from '../components/CustomTable';
import Button from "../components/Button"
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../../db"

const EditorPage = () => {

    const location = useLocation();
    const [QSR_Type, setQSR_Type] = useState('');
    const [Users, setUsers] = useState([]);
    const [Preparers, setPreparers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const ref = collection(db, 'users');
                const snapshot = await getDocs(ref);
                const UsersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const user_options = UsersData.map(user => ({
                    value: user.id,
                    label: `${user.name} - ${user.email}`
                }));
                setUsers(user_options);
            } catch (error) {
                console.error('Error fetching Users:', error);
            }
        };
        const fetchPreparers = async () => {
            try {
                const ref = collection(db, 'preparers');
                const snapshot = await getDocs(ref);
                const PreparersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const prep_options = PreparersData.map(user => ({
                    value: user.id,
                    label: `${user.name} - ${user.email}`
                }));
                setPreparers(prep_options);
            } catch (error) {
                console.error('Error fetching Preparers:', error);
            }
        };

        fetchUsers();
        fetchPreparers();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const qsrTypeParam = searchParams.get('qsr_type');
        setQSR_Type(qsrTypeParam);
    }, [location.search]);

    const [action, setAction] = useState("");

    const handleAction = (actionType) => {
        setAction(actionType)
    }

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
                    <h1 className="text-black font-bold text-[25px] mt-5 mb-5">Prepare Quote for & Preparer:</h1>
                </div>
                <div className="w-[90%] grid grid-cols-1 mt-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
                    <div className='w-full flex flex-col justify-center items-start gap-2'>
                        <label className='font-semibold text-[20px] text-start' htmlFor="users">Select User</label>
                        {Users && (<Select id='users' name='users' className='w-full' options={Users} />)}
                    </div>
                    <div className='w-full flex flex-col justify-center items-start gap-2'>
                        <label className='font-semibold text-[20px] text-start' htmlFor="preparers">Select Preparer</label>
                        {Preparers && (<Select id='preparers' name='preparers' className='w-full' options={Preparers} />)}
                    </div>
                </div>

                <div className="w-[90%] flex mt-[20px] flex-col gap-5 justify-center items-start">
                    {QSR_Type && (<h1 className="text-black font-bold text-[25px] mt-5 mb-5">
                        Quote Summary Report <span className="font-semibold">({QSR_Type})</span>
                    </h1>)}
                    <SubOptButton actionType={handleAction} />
                </div>

                {QSR_Type && (<CustomTable QSR={QSR_Type} />)}

                <div className="w-[90%] mt-[20px] flex flex-col justify-end items-end">
                    <div className="md:w-[30%] w-full pr-0 md:pr-2">
                        <Button onClickProp={null} text={"Submit Quote"} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default EditorPage