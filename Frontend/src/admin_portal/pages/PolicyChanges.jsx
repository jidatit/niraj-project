import React, { useState, useEffect, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table'
import { Modal, Slide, Box, Button, Grid, Typography } from '@mui/material'
import { db } from '../../../db'
import { collection, getDocs } from 'firebase/firestore'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const PolicyChanges = () => {
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = (rowData) => {
        setSelectedRowData(rowData);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
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
                        onClick={() => handleOpenModal(cell.row.original)}
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

                {selectedRowData && (<ViewPolicyModal openModal={openModal} handleCloseModal={handleCloseModal} selectedRowData={selectedRowData} />)}

            </div>
        </>
    )
}

export const ViewPolicyModal = ({ openModal, handleCloseModal, selectedRowData }) => {
    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Slide direction="up" in={openModal} mountOnEnter unmountOnExit>
                <div className="modal">
                    <Box sx={{ width: 600, height: 550, overflowY: "auto", bgcolor: 'background.paper', p: 3 }}>
                        <Typography variant="h5" id="modal-modal-title" gutterBottom>
                            Policy Changes
                        </Typography>
                        <Typography sx={{ marginBottom: "20px" }} variant="body1"><strong>Details of Changes:</strong> {selectedRowData.changesAnswer}</Typography>
                        <Typography variant="h5" id="modal-modal-title" gutterBottom>
                            Policy Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1"><strong>Policy ID:</strong> {selectedRowData.policy_id}</Typography>
                                <Typography variant="body1"><strong>Acc Loan Number:</strong> {selectedRowData.acc_loan_number}</Typography>
                                <Typography variant="body1"><strong>Bound Date:</strong> {selectedRowData.bound_date}</Typography>
                                <Typography variant="body1"><strong>Bound Status:</strong> {selectedRowData.bound_status}</Typography>
                                <Typography variant="body1"><strong>Carrier:</strong> {selectedRowData.carrier}</Typography>
                                <Typography variant="body1"><strong>Company Name:</strong> {selectedRowData.company_name}</Typography>
                                <Typography variant="body1"><strong>Effective Date:</strong> {selectedRowData.effective_date}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1"><strong>Is Mortgage or Lienholder:</strong> {selectedRowData.isMortgageOrLienholder}</Typography>
                                <Typography variant="body1"><strong>Policy Change ID:</strong> {selectedRowData.policy_change_id}</Typography>
                                <Typography variant="body1"><strong>QID:</strong> {selectedRowData.qid}</Typography>
                                <Typography variant="body1"><strong>QSR Type:</strong> {selectedRowData.qsr_type}</Typography>
                                <Typography variant="body1"><strong>Responsible Payment:</strong> {selectedRowData.responsible_payment}</Typography>
                            </Grid>
                        </Grid>
                        <Typography sx={{ marginTop: "10px" }} variant="h5" id="modal-modal-title" gutterBottom>
                            User Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1"><strong>Client Name:</strong> {selectedRowData.user.name}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {selectedRowData.user.email}</Typography>
                                <Typography variant="body1"><strong>Date of Birth:</strong> {selectedRowData.user.dateOfBirth}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1"><strong>User Type:</strong> {selectedRowData.user.signupType}</Typography>
                                <Typography variant="body1"><strong>Phone Number:</strong> {selectedRowData.user.phoneNumber}</Typography>
                                <Typography variant="body1"><strong>Mailing Address:</strong> {selectedRowData.user.mailingAddress}</Typography>
                            </Grid>
                        </Grid>
                        <Button onClick={handleCloseModal} style={{ marginTop: '20px' }}>Close</Button>
                    </Box>
                </div>
            </Slide>
        </Modal>
    );
};


export default PolicyChanges