import React, { useState, useEffect, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Modal, Slide, Box } from '@mui/material'
import { db } from '../../../db'
import { collection, getDocs } from 'firebase/firestore'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const PolicyChanges = () => {
    const dataType = {
        CHANGES: 'changes',
        CANCELS: 'cancels'
    };
    const [PolicyChangeData, setPolicyChangeData] = useState(null);
    const [CancelPolicyData, setCancelPolicyData] = useState(null);
    const [showType, setShowType] = useState(dataType.CHANGES);

    const handleChange = (type) => {
        if (type === "cancels") {
            setShowType(dataType.CANCELS);
        } else if (type === "changes") {
            setShowType(dataType.CHANGES);
        }
    };

    useEffect(() => {

        const getAllCancelPolicyData = async () => {
            try {
                const collRef = collection(db, "cancel_policies");
                const cpSnapshot = await getDocs(collRef)
                const CPdata = cpSnapshot.docs.map(doc => ({ cancel_policy_id: doc.id, ...doc.data() }))
                setCancelPolicyData(CPdata)
                console.log(CPdata)
            } catch (error) {
                console.log("error", error)
            }
        }

        const getAllPolicyChangeData = async () => {
            try {
                const pcdata = collection(db, 'policy_changes');
                const pcsnapshot = await getDocs(pcdata);
                const PCData = pcsnapshot.docs.map(doc => ({ policy_change_id: doc.id, ...doc.data() }));
                setPolicyChangeData(PCData)
                console.log(PCData)
            } catch (error) {
                console.log("error", error)
            }
        }

        getAllCancelPolicyData();
        getAllPolicyChangeData();
    }, [])

    const PC_columns = useMemo(() => [
        {
            accessorKey: 'user.name',
            header: 'Client Name',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            accessorKey: 'user.signupType',
            header: 'User Type',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            accessorKey: 'user.email',
            header: 'Email',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            accessorKey: 'changesAnswer',
            header: 'Details of Changes',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            header: 'Actions',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    <button
                        className='bg-[#003049] rounded-[18px] px-[36px] py-[4px] text-white text-[14px]'>
                        View Details
                    </button>
                </Box>
            )
        },
    ], [])

    const CP_columns = useMemo(() => [
        {
            accessorKey: 'user.name',
            header: 'Client Name',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            accessorKey: 'user.signupType',
            header: 'User Type',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            accessorKey: 'user.email',
            header: 'Email',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            accessorKey: 'type',
            header: 'Request',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    {cell.getValue().length > 100 ? cell.getValue().slice(0, 100) + '...' : cell.getValue()}
                </Box>
            )
        },
        {
            header: 'Actions',
            size: 100,
            Cell: ({ cell }) => (
                <Box >
                    <button
                        className='bg-[#b43232] rounded-[18px] px-[36px] py-[4px] text-white text-[14px]'>
                        Confirm Cancel
                    </button>
                </Box>
            )
        },
    ], [])

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">

                <div className='w-full flex flex-col justify-center items-center'>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Policy Action Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={showType}
                            label="Policy Action Type"
                            onChange={(e) => handleChange(e.target.value)}
                        >
                            <MenuItem value={dataType.CANCELS}>Cancels</MenuItem>
                            <MenuItem value={dataType.CHANGES}>Changes</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {showType === 'changes' && PolicyChangeData && (
                    <div className="table mt-[50px] w-full">
                        <MaterialReactTable
                            columns={PC_columns}
                            data={PolicyChangeData}
                        />
                    </div>
                )}

                {showType === 'cancels' && CancelPolicyData && (
                    <div className="table mt-[50px] w-full">
                        <MaterialReactTable
                            columns={CP_columns}
                            data={CancelPolicyData}
                        />
                    </div>
                )}

            </div>
        </>
    )
}

export default PolicyChanges