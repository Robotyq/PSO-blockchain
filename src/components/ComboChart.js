import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchGlobalMin} from '@/scripts/blockchain';

const ComboChart = ({web3, account, controller, particles, currentBlock}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                type: 'bar',
                label: 'Current Value',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                type: 'line',
                label: 'Global Minimum',
                data: [],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    });

    const [globalMin, setGlobalMin] = useState(null);

    const fetchMin = async () => {
        if (controller) {
            try {
                const min = await fetchGlobalMin(controller);
                setGlobalMin(min);
            } catch (error) {
                console.error('Error fetching global minimum:', error);
            }
        }
    };

    useEffect(() => {
        if (controller) {
            fetchMin();
        }
    }, [controller, currentBlock]);

    useEffect(() => {
        if (particles && globalMin) {
            const labels = [...chartData.labels, `Iteration ${chartData.labels.length + 1}`];
            const currentValues = particles.map(p => Number(p.position[2]));
            const globalMinValue = Number(globalMin[2]);

            setChartData(prevData => ({
                labels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: [...prevData.datasets[0].data, ...currentValues],
                    },
                    {
                        ...prevData.datasets[1],
                        data: [...prevData.datasets[1].data, globalMinValue],
                    },
                ],
            }));
        }
        console.log("dataSet", chartData)
    }, [particles, globalMin]);

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className={styles.chartContainer}>
            <Bar data={chartData} options={options}/>
        </div>
    );
};

export default ComboChart;
