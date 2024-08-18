import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const MovedEventsChart = ({web3, controller, account, currentBlock, particles, selectedParticle}) => {
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
        function isMyParticleAndFromBlock(event, block) {
            if (event.blockNumber !== block)
                return false;
            // console.log("event.particle: ", event.particle)
            // console.log("selectedParticle: ", selectedParticle)
            return event.particle === selectedParticle;
            return particles.some(particle => particle.address === event.particle);
        }

        try {
            const events = await fetchEventsData(web3, controller, 0);
            const movedEvents = events.filter(event => event.event === 'Moved');

            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))];
            blocks.sort((a, b) => Number(a) - Number(b));

            const totalMovedEvents = blocks.map(block =>
                movedEvents.filter(event => event.blockNumber === block).length
            );

            const myMovedEvents = blocks.map(block =>
                movedEvents.filter(event => isMyParticleAndFromBlock(event, block)).length
            );

            const remainingEvents = totalMovedEvents.map((total, index) => total - myMovedEvents[index]);
            console.log("myMovedEvents: ", myMovedEvents)
            console.log("totalMovedEvents: ", totalMovedEvents)
            console.log("remainingEvents: ", remainingEvents)

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'bar',
                        label: 'My Particles\' Iterations',
                        data: myMovedEvents,
                        backgroundColor: 'rgba(246,38,38,0.8)', // Bottom portion for individual particle iterations
                        borderColor: 'rgb(239,9,9)',
                        borderWidth: 1,
                        stack: 'Stack 0',
                    },
                    {
                        type: 'bar',
                        label: 'Other Iterations',
                        data: remainingEvents,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Upper portion for remaining iterations
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        stack: 'Stack 0', // Stack on top of the individual particle iterations
                    },
                ]
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

export default MovedEventsChart;
