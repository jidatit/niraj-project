import React, { useEffect, useState, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';

const CustomTablePreviewAdmin = ({ qsr_type, table2_data }) => {

    const [tableCols1, setTableCols1] = useState(null);

    const table_columns_lia = useMemo(
        () => [
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
        ],
        [],
    );
    const table_columns_flood = useMemo(
        () => [
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
        ],
        [],
    );
    const table_columns_auto = useMemo(
        () => [
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
                accessorKey: 'comprehensive_deductible',
                header: 'Comprehensive Deductible',
                size: 150,
            },
        ],
        [],
    );
    const table_columns_home = useMemo(
        () => [
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
        ],
        [],
    );

    useEffect(() => {
        let columns;
        if (qsr_type.toLowerCase() === "liability") {
            columns = table_columns_lia;
        } else if (qsr_type.toLowerCase() === "auto") {
            columns = table_columns_auto;
        } else if (qsr_type.toLowerCase() === "flood") {
            columns = table_columns_flood;
        } else if (qsr_type.toLowerCase() === "home") {
            columns = table_columns_home;
        } else {
            columns = null;
        }
        setTableCols1(columns);
    }, [qsr_type]);

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
                size: 800,
                Cell: ({ cell }) => (
                    <Box >
                        {cell.getValue() == 0.00 ? "Risk does not meet underwriting guidelines." : cell.getValue()}
                    </Box>
                )
            },
        ],
        [],
    );

    return (
        <>
            <div className="w-full flex mt-[20px] flex-col justify-center items-start">
                {table_columns_2 && table2_data && (<div className="w-full">
                    <MaterialReactTable
                        columns={table_columns_2}
                        data={table2_data}
                        enableBottomToolbar={true}
                        enableTopToolbar={false}
                        enableTableHead={true}
                    />
                </div>)}
            </div>
        </>
    )
}

export default CustomTablePreviewAdmin