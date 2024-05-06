import React, { useEffect, useState, useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table';

const CustomTable = ({ QSR }) => {

    const [tableCols1, setTableCols1] = useState(null);
    const [tableData1, setTableData1] = useState(null);

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
            carrier: "Monarch",
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
            carrier: "Monarch",
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
            carrier: "Monarch",
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
            carrier: "Monarch",
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

    useEffect(() => {
        if (QSR === "Liability" || QSR === "liability") {
            setTableCols1(table_columns_lia)
            setTableData1(data_lia)
        } else if (QSR === "Flood" || QSR === "flood") {
            setTableCols1(table_columns_flood)
            setTableData1(data_flood)
        } else if (QSR === "Auto" || QSR === "auto") {
            setTableCols1(table_columns_auto)
            setTableData1(data_auto)
        } else if (QSR === "Home" || QSR === "home") {
            setTableCols1(table_columns_home)
            setTableData1(data_home)
        }
        else {
            setTableCols1([])
            setTableData1([])
        }
    }, [QSR])

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

    return (
        <>
            <div className="w-[90%] flex mt-[20px] flex-col justify-center items-start">
                {tableCols1 && tableData1 && (<div className="table w-full">
                    <MaterialReactTable
                        columns={tableCols1}
                        data={tableData1}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                    />
                </div>)}
                <div className="table w-full">
                    <MaterialReactTable
                        columns={table_columns_2}
                        data={data_2}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        enableTableHead={false}
                    />
                </div>
            </div>
        </>
    )
}

export default CustomTable