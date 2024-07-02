import React, { useEffect, useState, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table';
import SubOptButton from './SubOptButton';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';
import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const CustomTable = ({ QSR, tableData }) => {

    const [CmsData, setCmsData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCmsData = async () => {
            try {
                const { data } = await axiosInstance.get("/get_quotes");
                setCmsData(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDataWithDelay = () => {
            setLoading(true);
            setTimeout(() => {
                fetchCmsData();
            }, 2000);
        };

        fetchDataWithDelay();

        const interval = setInterval(fetchDataWithDelay, 120000);

        return () => clearInterval(interval);
    }, []);

    const [tableCols1, setTableCols1] = useState(null);
    const [tableData1, setTableData1] = useState(null);
    const [tableCols2, setTableCols2] = useState(null);
    const [tableData2, setTableData2] = useState(null);
    const [actionType, setactionType] = useState(null);
    const [CreateModalOpen1, setCreateModalOpen1] = useState(false);
    const [CreateModalOpen2, setCreateModalOpen2] = useState(false);

    const table_columns_lia = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                header: 'Carrier',
                size: 150,
            },
            {
                accessorKey: 'liability_coverage_amount',
                header: 'Liability Coverage Amount',
                size: 200,
            },
            {
                accessorKey: 'um_coverage',
                header: 'U/M Coverage',
                size: 150,
            },
            {
                accessorKey: 'cyber_liability',
                header: 'Cyber Liability',
                size: 150,
            },
            {
                accessorKey: 'identity_theft',
                header: 'Identity Theft',
                size: 150,
            },
            {
                accessorKey: 'premium',
                header: 'Premium',
                size: 150,
            },
        ],
        [],
    );
    const data_lia = [
        {
            id: 1,
            carrier: "Liability Monarch",
            liability_coverage_amount: "700000",
            um_coverage: "14000",
            cyber_liability: "75000",
            identity_theft: "300000",
            premium: "140000",
        },
    ];
    const table_columns_flood = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                header: 'Carrier',
                size: 150,
            },
            {
                accessorKey: 'dwelling',
                header: 'Dwelling',
                size: 200,
            },
            {
                accessorKey: 'personal_property',
                header: 'Personal Property',
                size: 150,
            },
            {
                accessorKey: 'premium',
                header: 'Premium',
                size: 150,
            },
        ],
        [],
    );
    const data_flood = [
        {
            id: 1,
            carrier: "Flood Monarch",
            dwelling: "700000",
            personal_property: "14000",
            premium: "75000",
        },
    ];
    const table_columns_auto = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                header: 'Carrier',
                size: 150,
            },
            {
                accessorKey: 'bodily_injury',
                header: 'Bodily Injury',
                size: 200,
            },
            {
                accessorKey: 'property_damage',
                header: 'Property Damage',
                size: 150,
            },
            {
                accessorKey: 'um',
                header: 'U/M',
                size: 150,
            },
            {
                accessorKey: 'collision_deductible',
                header: 'Collision Deductible',
                size: 150,
            },
            {
                accessorKey: 'rental',
                header: 'Rental',
                size: 150,
            },
            {
                accessorKey: 'roadside',
                header: 'Roadside',
                size: 150,
            },
            {
                accessorKey: 'premium',
                header: 'Premium',
                size: 150,
            },
            {
                accessorKey: 'comprehensive_deductible',
                header: 'Comprehensive Deductible',
                size: 150,
            },
        ],
        [],
    );
    const data_auto = [
        {
            id: 1,
            carrier: "Auto Monarch",
            bodily_injury: "700000",
            property_damage: "14000",
            um: "75000",
            collision_deductible: "300000",
            rental: "140000",
            roadside: "75000",
            premium: "75000",
            comprehensive_deductible: "75000",
        },
    ];
    const table_columns_home = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                header: 'Carrier',
                size: 150,
            },
            {
                accessorKey: 'dwelling',
                header: 'Dwelling',
                size: 150,
            },
            {
                accessorKey: 'other_structures',
                header: 'Other Structures',
                size: 150,
            },
            {
                accessorKey: 'contents',
                header: 'Contents',
                size: 150,
            },
            {
                accessorKey: 'loss_of_use',
                header: 'Loss of Use',
                size: 150,
            },
            {
                accessorKey: 'liability',
                header: 'Liability',
                size: 150,
            },
            {
                accessorKey: 'medical_payments',
                header: 'Medical Payments',
                size: 150,
            },
            {
                accessorKey: 'aop_deductible',
                header: 'AOP Deductible',
                size: 150,
            },
            {
                accessorKey: 'hurricane_deductible',
                header: 'Hurricane Deductible',
                size: 150,
            },
            {
                accessorKey: 'premium',
                header: 'Premium',
                size: 150,
            },
        ],
        [],
    );
    const data_home = [
        {
            id: 1,
            carrier: "Home Monarch",
            dwelling: "700000",
            other_structures: "14000",
            contents: "75000",
            loss_of_use: "300000",
            liability: "140000",
            medical_payments: "140000",
            aop_deductible: "75000",
            hurricane_deductible: "75000",
            premium: "75000",
        },
    ];

    const table_columns_2 = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                size: 200,
            },
            {
                accessorKey: 'description',
                size: 800,
            },
        ],
        [],
    );
    const data_2 = [
        {
            id: 1,
            carrier: "Monarch",
            description: "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations",
        },
        {
            id: 2,
            carrier: "Monarch",
            description: "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations",
        },
        {
            id: 3,
            carrier: "Monarch",
            description: "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations",
        },
        {
            id: 4,
            carrier: "Monarch",
            description: "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations",
        },
        {
            id: 5,
            carrier: "Monarch",
            description: "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations",
        },
    ];

    useEffect(() => {
        if (QSR === "Liability" || QSR === "liability") {
            setTableCols1(table_columns_lia);
            setTableData1(data_lia);
            setTableCols2(table_columns_2);
            setTableData2(data_2);
            tableData(data_lia, 1);
            tableData(data_2, 2);
        } else if (QSR === "Flood" || QSR === "flood") {
            setTableCols1(table_columns_flood);
            setTableData1(data_flood);
            setTableCols2(table_columns_2);
            setTableData2(data_2);
            tableData(data_flood, 1);
            tableData(data_2, 2);
        } else if (QSR === "Auto" || QSR === "auto") {
            setTableCols1(table_columns_auto);
            setTableData1(data_auto);
            setTableCols2(table_columns_2);
            setTableData2(data_2);
            tableData(data_auto, 1);
            tableData(data_2, 2);
        } else if (QSR === "Home" || QSR === "home") {
            setTableCols1(table_columns_home);
            setTableData1(data_home);
            setTableCols2(table_columns_2);
            setTableData2(data_2);
            tableData(data_home, 1);
            tableData(data_2, 2);
        } else {
            setTableCols1([]);
            setTableData1([]);
            setTableCols2([]);
            setTableData2([]);
            tableData([], 1);
            tableData([], 2);
        }
    }, [QSR]);

    const handleSaveRowTable1 = async ({ exitEditingMode, row, values }) => {
        tableData1[row.index] = values;
        setTableData1([...tableData1]);
        tableData(tableData1, 1)
        exitEditingMode();
    };
    const handleSaveRowTable2 = async ({ exitEditingMode, row, values }) => {
        tableData2[row.index] = values;
        setTableData2([...tableData2]);
        tableData(tableData2, 2)
        exitEditingMode();
    };

    const handleActionChange = (actionType) => {
        setactionType(actionType)
        if (actionType.includes("Numbers")) {
            setCreateModalOpen1(true)
            setCreateModalOpen2(false)
        } else if (actionType.includes("Words")) {
            setCreateModalOpen2(true)
            setCreateModalOpen1(false)
        }
    }

    const handleNewNumberRow = (values) => {
        tableData1.push(values);
        setTableData1([...tableData1]);
        tableData(tableData1, 1)
    };

    const handleNewWordRow = (values) => {
        tableData2.push(values);
        setTableData2([...tableData2]);
        tableData(tableData2, 2)
    };

    return (
        <>
            <div className="w-[90%] flex mt-[20px] flex-col justify-center items-start">

                <div className="mt-5 mb-5 w-full">
                    <SubOptButton actionType={handleActionChange} />
                </div>

                <div className="mt-5 mb-5 w-full">
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">(Data reloads after every 2 minutes)</span> More data may come in a while!
                    </div>
                    {CmsData && (
                        <div className='relative'>
                            {loading && (
                                <div className="absolute inset-0 flex items-center gap-1 justify-center bg-gray-100 bg-opacity-50 z-50">
                                    <div className='h-6 w-6 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='h-6 w-6 bg-black rounded-full animate-bounce [animation-delay:-0.20s]'></div>
                                    <div className='h-6 w-6 bg-black rounded-full animate-bounce'></div>
                                </div>
                            )}
                            <JsonView data={CmsData} shouldExpandNode={allExpanded} style={darkStyles} />
                        </div>
                    )}
                </div>

                {tableCols1 && tableData1 && (<div className="w-full">
                    <MaterialReactTable
                        columns={tableCols1}
                        data={tableData1}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        enableEditing={true}
                        onEditingRowSave={handleSaveRowTable1}
                    />
                </div>)}
                {tableCols2 && tableData2 && (<div className="w-full">
                    <MaterialReactTable
                        columns={tableCols2}
                        data={tableData2}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        enableTableHead={false}
                        enableEditing={true}
                        onEditingRowSave={handleSaveRowTable2}
                    />
                </div>)}
            </div>


            <AddNumberRowModal
                columns={tableCols1}
                open={CreateModalOpen1}
                onClose={() => setCreateModalOpen1(false)}
                onSubmit={handleNewNumberRow}
            />

            <AddWordRowModal
                columns={tableCols2}
                open={CreateModalOpen2}
                onClose={() => setCreateModalOpen2(false)}
                onSubmit={handleNewWordRow}
            />


        </>
    )
}


export const AddNumberRowModal = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState(() =>
        columns && columns?.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Add New Number Row</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns && columns?.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Add New Number Row
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const AddWordRowModal = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState(() =>
        columns && columns?.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Add New Word Row</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        <TextField
                            key={"carrier"}
                            label={"Carrier"}
                            name={"carrier"}
                            onChange={(e) =>
                                setValues({ ...values, [e.target.name]: e.target.value })
                            }
                        />
                        <TextField
                            key={"description"}
                            label={"Description"}
                            name={"description"}
                            onChange={(e) =>
                                setValues({ ...values, [e.target.name]: e.target.value })
                            }
                        />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Add New Word Row
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomTable