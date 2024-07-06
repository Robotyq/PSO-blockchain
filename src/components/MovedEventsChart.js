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
        if (controller && currentBlock && particles.length > 0) {
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

            const totalGasCosts = await Promise.all(blocks.map(async block => {
                const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                const gasCosts = await Promise.all(eventsInBlock.map(async event => {
                    const receipt = await web3.eth.getTransactionReceipt(event.transactionHash);
                    return receipt.gasUsed;
                }));
                return gasCosts.reduce((acc, gas) => acc + Number(gas), 0);
            }));

            const myGasCosts = await Promise.all(blocks.map(async block => {
                const eventsInBlock = movedEvents.filter(event => isMyParticleAndFromBlock(event, block));
                const gasCosts = await Promise.all(eventsInBlock.map(async event => {
                    const receipt = await web3.eth.getTransactionReceipt(event.transactionHash);
                    return receipt.gasUsed;
                }));
                return gasCosts.reduce((acc, gas) => acc + Number(gas), 0);
            }));

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

export default MovedEventsChart;
