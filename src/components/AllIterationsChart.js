import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const AllIterationsChart = ({web3, controller, currentBlock, particles}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (controller && particles.length > 0) {
            fetchEvents();
        }
    }, [controller, currentBlock, particles]);

    const fetchEvents = async () => {
        try {
            const events = await fetchEventsData(web3, controller, 0);
            const movedEvents = events.filter(event => event.event === 'Moved');

            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))];
            blocks.sort((a, b) => Number(a) - Number(b));

            const generateColor = (index, total) => {
                const hue = 150 + (index * (240 - 150)) / total; // Green (150) to Blue (240)
                return `hsl(${hue}, 70%, 50%)`;
            };

            const particleDatasets = particles.map((particle, index) => {
                const particleMovedEvents = blocks.map(block =>
                    movedEvents.filter(event => event.blockNumber === block && event.particle === particle.address).length
                );

                return {
                    type: 'bar',
                    label: `Particle ${particle.address.slice(0, 4)}...${particle.address.slice(-4)}`,
                    data: particleMovedEvents,
                    backgroundColor: generateColor(index, particles.length),
                    borderColor: generateColor(index, particles.length),
                    borderWidth: 1,
                    stack: 'Stack 0', // Stack all particles together
                };
            });

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: particleDatasets,
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    return (
        <div className={styles.chartContainer}>
            {chartData.labels.length > 0 && (
                <Bar data={chartData} options={options}/>
            )}
        </div>
    );
};

export default AllIterationsChart;
