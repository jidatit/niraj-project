import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Premium History Line Graph',
        },
    },
};

const labels = ['2019', '2020', '2021', '2022', '2023', '2024'];
// const Yearlabels = ['2019', '2020', '2021', '2022', '2023', '2024'];
const Pricelabels = [1000, 2000, 7000, 4000, 5000, 3000, 6000];

export const data = {
    labels,
    datasets: [
        {
            label: 'Premium Price',
            data: Pricelabels,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        // {
        //     label: 'Year',
        //     data: Yearlabels,
        //     borderColor: 'rgb(53, 162, 235)',
        //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
        // },
    ],
};

const LineGraph = () => {
    return <Line options={options} data={data} />;
}

export default LineGraph