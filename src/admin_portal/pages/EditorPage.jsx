import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
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
    const [t1, sett1] = useState();
    const [formData, setFormData] = useState({
        user: {},
        preparer: {},
        tablesData: { table_1: {}, table_2: {} },
        qsr_type: ""
    });

    console.log("formDataP", formData)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const ref = collection(db, 'users');
                const snapshot = await getDocs(ref);
                const UsersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const user_options = UsersData.map(user => ({
                    value: user.id,
                    label: `${user.name} - ${user.email}`,
                    ...user
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
                    label: `${user.name} - ${user.email}`,
                    ...user
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
        setFormData({
            ...formData,
            qsr_type: qsrTypeParam
        })
    }, [location.search]);

    useEffect(() => {
        setFormData({
            ...formData,
            tablesData: {
                ...formData.tablesData,
                table_1: t1
            }
        });
    }, [t1])

    const getDatafromTable = (dataFromTable, tableNumber) => {
        if (tableNumber === 1) {
            sett1(dataFromTable)
        }
        if (tableNumber === 1) {
            setFormData({
                ...formData,
                tablesData: {
                    ...formData.tablesData,
                    table_1: dataFromTable
                }
            });
        } else if (tableNumber === 2) {
            setFormData({
                ...formData,
                tablesData: {
                    ...formData.tablesData,
                    table_2: dataFromTable
                }
            });
        }
    };

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                <div className="w-[90%] flex flex-col gap-5 justify-center items-start">
                    <h1 className="text-black font-bold text-[25px] mt-5 mb-5">Prepare Quote for & Preparer:</h1>
                </div>
                <div className="w-[90%] grid grid-cols-1 mt-[20px] lg:grid-cols-2 gap-5 justify-center items-center">
                    <div className='w-full z-30 flex flex-col justify-center items-start gap-2'>
                        <label className='font-semibold text-[20px] text-start' htmlFor="users">Select User</label>
                        {Users && (<Select id='users' value={formData.user} onChange={(selectedUser) => setFormData({ ...formData, user: selectedUser })} name='user' className='w-full' options={Users} />)}
                    </div>
                    <div className='w-full flex z-20 flex-col justify-center items-start gap-2'>
                        <label className='font-semibold text-[20px] text-start' htmlFor="preparers">Select Preparer</label>
                        {Preparers && (<Select id='preparers' value={formData.preparer} onChange={(selectedPreparer) => setFormData({ ...formData, preparer: selectedPreparer })} name='preparer' className='w-full' options={Preparers} />)}
                    </div>
                </div>

                <div className="w-[90%] flex mt-[20px] mb-[20px] flex-col gap-5 justify-center items-start">
                    {QSR_Type && (<h1 className="text-black font-bold text-[25px] mt-5 mb-5">
                        Quote Summary Report <span className="font-semibold">({QSR_Type})</span>
                    </h1>)}
                </div>

                {QSR_Type && (<CustomTable QSR={QSR_Type} tableData={getDatafromTable} />)}

                <div className="w-[90%] mt-[20px] flex flex-col justify-end items-end">
                    <div className="md:w-[30%] w-full pr-0 md:pr-2">
                        <Button onClickProp={() => { console.log("click", formData) }} text={"Submit Quote"} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default EditorPage