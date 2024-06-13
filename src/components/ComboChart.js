import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchGlobalMin} from '@/scripts/blockchain';

const ComboChart = ({controller, particles, currentBlock}) => {
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
        if (particles && particles.length > 0 && globalMin && currentBlock) {
            const labels = [...chartData.labels, `Iteration ${chartData.labels.length + 1}`];

            const newDatasets = particles.map((particle, index) => {
                const existingDataset = chartData.datasets.find(dataset => dataset.label === `Particle ${index + 1}`);
                return {
                    type: 'bar',
                    label: `Particle ${index + 1}`,
                    data: existingDataset ? [...existingDataset.data, Number(particle.position[2])] : [Number(particle.position[2])],
                    backgroundColor: existingDataset ? existingDataset.backgroundColor : `rgba(${5 + index * 100}, 192, 192, 0.5)`,
                    borderColor: existingDataset ? existingDataset.borderColor : `rgba(${10 + index * 80}, 192, 192, 1)`,
                    borderWidth: 1,
                };
            });

            const globalMinDataset = chartData.datasets.find(dataset => dataset.label === 'Global Minimum');
            const globalMinData = globalMinDataset ? [...globalMinDataset.data, globalMin[2]] : [globalMin[2]];

            const newChartData = {
                labels,
                datasets: [
                    ...newDatasets,
                    {
                        type: 'line',
                        label: 'Global Minimum',
                        data: globalMinData,
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                    },
                ],
            };
            console.log("chartData: ", newChartData)
            setChartData(newChartData);
        }
    }, [particles]);

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
