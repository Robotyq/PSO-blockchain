import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const MovedEventsChart = ({web3, controller, account, currentBlock, particles}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (controller && currentBlock) {
            fetchEvents();
        }
    }, [controller, currentBlock, particles]);

    const fetchEvents = async () => {
        function isMyParticleAndFromBlock(event, block) {
            if (event.blockNumber !== block)
                return false;
            let isMine = false;
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].address === event.particle) {
                    isMine = true;
                    break;
                }
            }
            return isMine;
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
            console.log("myMovedEvents: ", myMovedEvents)

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'line',
                        label: 'Total Iterations',
                        data: totalMovedEvents,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                    },
                    {
                        type: 'bar',
                        label: 'My particles\'s Iterations',
                        data: myMovedEvents,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }
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
        },
    };

    return (
        <div className={styles.chartContainer}>
            {chartData.labels.length > 0 && (
                <>
                    <Line data={chartData} options={options}/>
                    {/*<Bar data={chartData} options={options} />*/}
                </>
            )}
        </div>
    );
};

export default MovedEventsChart;
