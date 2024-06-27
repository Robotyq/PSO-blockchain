import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const ComboChart = ({controller, currentBlock, web3}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [events, setEvents] = useState([]);
    const [globalMin, setGlobalMin] = useState(null);

    const fetchEvents = async () => {
        if (controller && currentBlock !== null) {
            try {
                const eventsData = await fetchEventsData(web3, controller, currentBlock);
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        }
    };

    useEffect(() => {
        if (controller) {
            fetchEvents();
        }
    }, [controller, currentBlock]);

    useEffect(() => {
        if (events.length > 0) {
            const labels = [];
            const newDatasets = [];
            let lastGlobalMin = globalMin;

            events.forEach(event => {
                if (event.event === 'Moved') {
                    labels.push(`Block ${event.blockNumber}`);
                    const particleData = event.returnValues.newValue.map(val => Number(val));
                    const existingDataset = newDatasets.find(dataset => dataset.label === `Particle ${event.returnValues.particle}`);
                    if (existingDataset) {
                        existingDataset.data.push(particleData[2]);
                    } else {
                        newDatasets.push({
                            type: 'bar',
                            label: `Particle ${event.returnValues.particle}`,
                            data: [particleData[2]],
                            backgroundColor: `rgba(${15 + newDatasets.length * 120}, 192, 192, 0.5)`,
                            borderColor: `rgba(${15 + newDatasets.length * 120}, 192, 192, 1)`,
                            borderWidth: 5,
                        });
                    }
                } else if (event.event === 'NewBestGlobal') {
                    lastGlobalMin = event.returnValues.newVar.map(val => Number(val));
                    if (lastGlobalMin[2] > 10000000000000) {
                        lastGlobalMin = lastGlobalMin.map(val => val / 1000000000000000000);
                    }
                } else if (event.event === 'TargetFunctionUpdated') {
                    // Reset chart data if TargetFunctionUpdated event occurs
                    setChartData({
                        labels: [],
                        datasets: [],
                    });
                }
            });

            if (lastGlobalMin) {
                const globalMinDataset = chartData.datasets.find(dataset => dataset.label === 'Global Minimum');
                const globalMinData = globalMinDataset ? [...globalMinDataset.data, lastGlobalMin[2]] : [lastGlobalMin[2]];
                newDatasets.push({
                    type: 'line',
                    label: 'Global Minimum',
                    data: globalMinData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                });
            }

            setChartData({
                labels,
                datasets: newDatasets,
            });
            setGlobalMin(lastGlobalMin);
        }
    }, [events]);

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
