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

        const getTransactionDetails = async (transactionHash) => {
            if (cache.has(transactionHash)) {
                return cache.get(transactionHash);
            } else {
                // const transaction = await web3.eth.getTransaction(transactionHash);
                const receipt = await web3.eth.getTransactionReceipt(transactionHash);
                const details = {
                    from: receipt.from,
                    gasUsed: receipt.gasUsed
                };
                cache.set(transactionHash, details);
                return details;
            }
        };

        try {
            const events = await fetchEventsData(web3, controller, 0);
            const movedEvents = events.filter(event => event.event === 'Moved');

            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))].sort((a, b) => Number(a) - Number(b));

            const calculateGasCosts = async (blocks, events, filterFunction) => {
                const blockGasCostsPromises = blocks.map(async block => {
                    const eventsInBlock = events.filter(event => filterFunction(event, block));
                    const uniqueTransactionHashes = [...new Set(eventsInBlock.map(event => event.transactionHash))];
                    const gasCosts = await Promise.all(uniqueTransactionHashes.map(transactionHash => getTransactionDetails(transactionHash)));
                    return gasCosts.reduce((acc, details) => acc + Number(details.gasUsed), 0);
                });
                return await Promise.all(blockGasCostsPromises);
            };

            const isMyParticleAndFromBlock = (event, block) => {
                const transactionDetails = cache.get(event.transactionHash);
                // console.log("transactionDetails: ", transactionDetails)
                // console.log("account: ", account)
                return event.blockNumber === block
                    && particles.some(particle => particle.address === event.particle)
                    && transactionDetails.from.toLowerCase() === account.toLowerCase();
            };

            const totalGasCosts = await calculateGasCosts(blocks, movedEvents, (event, block) => event.blockNumber === block);
            const myGasCosts = await calculateGasCosts(blocks, movedEvents, isMyParticleAndFromBlock);

            // Convert gas costs to milliETH
            const totalGasCostsInMilliEth = totalGasCosts.map(gas => gas * 5 / 1e6);
            const myGasCostsInMilliEth = myGasCosts.map(gas => gas * 5 / 1e6);

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'line',
                        label: 'Total Gas Cost',
                        data: totalGasCostsInMilliEth,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                    },
                    {
                        type: 'bar',
                        label: 'My particles\'s Gas Cost',
                        data: myGasCostsInMilliEth,
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
                title: {
                    display: true,
                    text: 'Gas Used (milliETH)',
                },
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
