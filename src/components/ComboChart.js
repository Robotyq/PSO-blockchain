import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchGlobalMin} from '@/scripts/blockchain';

const ComboChart = ({web3, account, controller, particles, currentBlock}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
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

            const newDatasets = particles.map((particle, index) => {
                const existingDataset = chartData.datasets.find(dataset => dataset.label === `Particle ${index + 1}`);
                return {
                    type: 'bar',
                    label: `Particle ${index + 1}`,
                    data: existingDataset ? [...existingDataset.data, Number(particle.position[2])] : [Number(particle.position[2])],
                    backgroundColor: existingDataset ? existingDataset.backgroundColor : `rgba(${75 + index * 20}, 192, 192, 0.2)`,
                    borderColor: existingDataset ? existingDataset.borderColor : `rgba(${75 + index * 20}, 192, 192, 1)`,
                    borderWidth: 1,
                };
            });

            const globalMinDataset = {
                type: 'line',
                label: 'Global Minimum',
                data: chartData.datasets.length > 0 ? [...chartData.datasets[particles.length]?.data, Number(globalMin[2])] : [Number(globalMin[2])],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
            };

            setChartData({
                labels,
                datasets: [...newDatasets, globalMinDataset],
            });
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
            {chartData.labels.length > 0 && <Bar data={chartData} options={options}/>}
        </div>
    );
};

export default ComboChart;
