import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const GasCostChart = ({web3, controller, account, currentBlock, particles}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (controller && currentBlock && particles.length > 0) {
            fetchEvents();
        }
    }, [controller, currentBlock, particles]);

    const fetchEvents = async () => {
        const cache = new Map();

        const isMyParticleAndFromBlock = (event, block) => {
            return event.blockNumber === block && particles.some(particle => particle.address === event.particle);
        };

        const getGasCost = async (transactionHash) => {
            if (cache.has(transactionHash)) {
                return cache.get(transactionHash);
            } else {
                const receipt = await web3.eth.getTransactionReceipt(transactionHash);
                const gasUsed = receipt.gasUsed;
                cache.set(transactionHash, gasUsed);
                return gasUsed;
            }
        };

        try {
            const events = await fetchEventsData(web3, controller, 0);
            const movedEvents = events.filter(event => event.event === 'Moved');

            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))];
            blocks.sort((a, b) => Number(a) - Number(b));

            const totalGasCostsPromises = blocks.map(async block => {
                const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                const gasCosts = await Promise.all(eventsInBlock.map(event => getGasCost(event.transactionHash)));
                return gasCosts.reduce((acc, gas) => acc + Number(gas), 0);
            });

            const myGasCostsPromises = blocks.map(async block => {
                const eventsInBlock = movedEvents.filter(event => isMyParticleAndFromBlock(event, block));
                const gasCosts = await Promise.all(eventsInBlock.map(event => getGasCost(event.transactionHash)));
                return gasCosts.reduce((acc, gas) => acc + Number(gas), 0);
            });

            const totalGasCosts = await Promise.all(totalGasCostsPromises);
            const myGasCosts = await Promise.all(myGasCostsPromises);

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'line',
                        label: 'Total Gas Cost',
                        data: totalGasCosts,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                    },
                    {
                        type: 'bar',
                        label: 'My particles\'s Gas Cost',
                        data: myGasCosts,
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

export default GasCostChart;
