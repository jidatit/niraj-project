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
    Box
} from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';
import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const CustomTable = ({ QSR, tableData, user }) => {

    const homeCarriers = [
        "All Risks", "Allstate", "American Integrity", "American Traditions", "Bass Underwriters", "Centauri", "Citizens Policy Center", "Edison", "Florida Family", "Florida Peninsula", "GeoVera", "Heritage", "Monarch", "Olympus", "Orchid", "Peoples Trust", "SageSure", "Security First", "Slide", "Southern Oak", "Stillwater", "Tower Hill", "True", "TypTap Home", "Universal North America", "Universal PC", "VYRD", "Western World"
    ]

    const [CmsData, setCmsData] = useState([]);

    const [loading, setLoading] = useState(true);

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
                accessorKey: 'liability_coverage_amount',
                header: 'Liability Coverage Amount',
                size: 200,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'um_coverage',
                header: 'U/M Coverage',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'cyber_liability',
                header: 'Cyber Liability',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'identity_theft',
                header: 'Identity Theft',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
        ],
        [],
    );
    const data_lia = [
        {
            id: 1,
            liability_coverage_amount: "",
            um_coverage: "",
            cyber_liability: "",
            identity_theft: "",
        },
    ];
    const table_columns_flood = useMemo(
        () => [
            {
                accessorKey: 'dwelling',
                header: 'Dwelling',
                size: 200,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'personal_property',
                header: 'Personal Property',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
        ],
        [],
    );
    const data_flood = [
        {
            id: 1,
            dwelling: "",
            personal_property: "",
        },
    ];
    const table_columns_auto = useMemo(
        () => [
            {
                accessorKey: 'bodily_injury',
                header: 'Bodily Injury',
                size: 200,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'property_damage',
                header: 'Property Damage',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'um',
                header: 'U/M',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'collision_deductible',
                header: 'Collision Deductible',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'rental',
                header: 'Rental',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'roadside',
                header: 'Roadside',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'comprehensive_deductible',
                header: 'Comprehensive Deductible',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
        ],
        [],
    );
    const data_auto = [
        {
            id: 1,
            bodily_injury: "",
            property_damage: "",
            um: "",
            collision_deductible: "",
            rental: "",
            roadside: "",
            comprehensive_deductible: "",
        },
    ];
    const table_columns_home = useMemo(
        () => [
            {
                accessorKey: 'dwelling',
                header: 'Dwelling',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'other_structures',
                header: 'Other Structures',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'contents',
                header: 'Contents',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'loss_of_use',
                header: 'Loss of Use',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'liability',
                header: 'Liability',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'medical_payments',
                header: 'Medical Payments',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'aop_deductible',
                header: 'AOP Deductible',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
            {
                accessorKey: 'hurricane_deductible',
                header: 'Hurricane Deductible',
                size: 150,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue().length > 0 ? cell.getValue() : "Enter any value"}
                    </Box>
                )
            },
        ],
        [],
    );
    const data_home = [
        {
            id: 1,
            dwelling: "",
            other_structures: "",
            contents: "",
            loss_of_use: "",
            liability: "",
            medical_payments: "",
            aop_deductible: "",
            hurricane_deductible: "",
        },
    ];

    const table_columns_2 = useMemo(
        () => [
            {
                accessorKey: 'carrier',
                header: 'Carrier',
                size: 200,
            },
            {
                accessorKey: 'premium',
                header: 'Premium',
                size: 200,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue() == 0.00 ? "QB VIP HO3: Risk does not meet underwriting guidelines. See Messages for full list of underwriting violations." : cell.getValue()}
                    </Box>
                )
            },
        ],
        [],
    );
    const data_2 = [
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
        tableData2[row.index] = { ...values, id: row.original.id };
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

    const getRandomId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const idLength = 10;
        let result = '';

        for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    };

    const handleNewWordRow = (values) => {
        tableData2.push({ ...values, id: getRandomId() });
        setTableData2([...tableData2]);
        tableData(tableData2, 2);
    };

    useEffect(() => {
        const fetchCmsData = async () => {
            try {
                const { data } = await axiosInstance.get("/get_quotes");
                setCmsData(data);

                const homeQuotes = data.filter(quote => homeCarriers.includes(quote.Carrier));

                const filteredData = homeQuotes.map(quote => ({
                    id: quote.id,
                    email: quote.Email,
                    address: quote.Address,
                    zipCode: quote.zipCode ? quote.zipCode : "",
                    carrier: quote.Carrier || "",
                    premium: quote.ReturnAmount || 0
                }));

                if (user && user.email && user.zipCode) {
                    const filteredForUser = filteredData.filter(quote => quote.email.toLowerCase() === user.email.toLowerCase() && quote.zipCode.toLowerCase() === user.zipCode.toLowerCase());

                    setTableData2(filteredForUser);
                    tableData(filteredForUser, 2);
                } else {
                    console.warn("User or user email/address not defined.");
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
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
    }, [user.email, user.zipCode]);

    const handleWordRowDelete = (id) => {
        const updatedData = tableData2 && tableData2.filter(row => row.id !== id)
        setTableData2(updatedData)
        tableData(updatedData, 2)
    }

    useEffect(() => {
        tableData(tableData2, 2)
        tableData(tableData1, 1)
    }, [tableData2, tableData1])

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
                    {/* {CmsData && (
                        <div className='relative custom'>
                            {loading && (
                                <div className="absolute inset-0 flex items-center gap-1 justify-center bg-gray-100 bg-opacity-50 z-50">
                                    <div className='h-6 w-6 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='h-6 w-6 bg-black rounded-full animate-bounce [animation-delay:-0.20s]'></div>
                                    <div className='h-6 w-6 bg-black rounded-full animate-bounce'></div>
                                </div>
                            )}
                            <JsonView data={CmsData} shouldExpandNode={allExpanded} style={darkStyles} />
                        </div>
                    )} */}
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
                        // state={{ isLoading: { loading } }}
                        initialState={{ density: "compact" }}
                        enableBottomToolbar={false}
                        // enableTopToolbar={false}
                        enableTableHead={true}
                        enableEditing={true}
                        onEditingRowSave={handleSaveRowTable2}
                        enableRowSelection
                        renderTopToolbarCustomActions={({ table }) => {
                            const handleDelete = () => {
                                const selectedRows = table.getSelectedRowModel().flatRows;

                                if (selectedRows.length === 1) {
                                    const selectedRow = selectedRows[0];
                                    const selectedRowId = selectedRow.original.id;
                                    handleWordRowDelete(selectedRowId)
                                } else {
                                    alert('Please select a single row to delete.');
                                }
                            };

                            return (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        color="error"
                                        // disabled={!table.getIsSomeRowsSelected()}
                                        onClick={handleDelete}
                                        variant="contained"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )
                        }}
                    />
                </div>)}
            </div>

            {tableCols2 && (<AddWordRowModal
                columns={tableCols2}
                open={CreateModalOpen2}
                onClose={() => setCreateModalOpen2(false)}
                onSubmit={handleNewWordRow}
            />)}


        </>
    )
}

export const AddWordRowModal = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState(() =>
        columns?.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}) || {}
    );
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        columns.forEach(column => {
            if (!values[column.accessorKey]) {
                newErrors[column.accessorKey] = `${column.header} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(values);
            onClose();
        }
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
                        {columns.map(column => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) => {
                                    setValues({ ...values, [e.target.name]: e.target.value });
                                    setErrors({ ...errors, [e.target.name]: '' });
                                }}
                                required
                                error={Boolean(errors[column.accessorKey])}
                                helperText={errors[column.accessorKey]}
                            />
                        ))}
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