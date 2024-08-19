import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const MyParticlesComboChart = ({web3, controller, account, particles, selectedParticle}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [totalGasUsed, setTotalGasUsed] = useState(0);

    useEffect(() => {
        if (controller && particles.length > 0) {
            fetchEvents();
        }
    }, [controller, particles]);

    const fetchEvents = async () => {
        const getTransactionDetails = async (transactionHash) => {
            const receipt = await web3.eth.getTransactionReceipt(transactionHash);
            return {
                from: receipt.from,
                gasUsed: receipt.gasUsed
            };
        };

        try {
            const events = await fetchEventsData(web3, controller, 0);
            const movedEvents = events.filter(event => event.event === 'Moved' && event.particle === selectedParticle.name);
            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))].sort((a, b) => Number(a) - Number(b));

            const myMovedEvents = await Promise.all(
                blocks.map(async block => {
                    const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                    return eventsInBlock.length;
                })
            );

            const myGasCosts = await Promise.all(
                blocks.map(async block => {
                    const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                    const gasCost = await eventsInBlock.reduce(async (accPromise, event) => {
                        const acc = await accPromise;
                        const transactionDetails = await getTransactionDetails(event.transactionHash);
                        console.log('transactionDetails.from', transactionDetails.from)
                        console.log('selectedParticle.owner', selectedParticle.owner)
                        if (transactionDetails.from.toLowerCase() !== selectedParticle.owner.toLowerCase()) {
                            console.log("ignoring, not owner")
                            return acc;
                        }
                        return acc + Number(transactionDetails.gasUsed);
                    }, Promise.resolve(0));
                    return gasCost;
                })
            );

            // Convert gas costs to milliETH
            const myGasCostsInMilliEth = myGasCosts.map(gas => gas * 5 / 1e6);
            let totalGasUsedInEth = myGasCostsInMilliEth.reduce((acc, gas) => acc + gas, 0);
            totalGasUsedInEth /= 1000;

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Selected Particle\'s Iterations',
                        data: myMovedEvents,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1',
                        order: 1,
                    },
                    {
                        type: 'line',
                        label: 'Selected Particle\'s Gas Cost',
                        data: myGasCostsInMilliEth,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                        yAxisID: 'y2',
                        order: 2,
                    },
                ]
            });
            setTotalGasUsed(totalGasUsedInEth);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const options = {
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Iterations',
                },
            },
            y2: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Gas Used (milliETH)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div className={styles.chartContainerWithCard}>
            <div className={styles.chartWrapper}>
                {chartData.labels.length > 0 && (
                    <Bar data={chartData} options={options}/>
                )}
            </div>
            <div className={styles.totalGasCard}>
                <h3>Total Gas</h3>
                <h4>{totalGasUsed.toFixed(6)} ETH</h4>
                <p>Total Gas Used by the owner in order to iterate this particle</p>
            </div>
        </div>
    );
};

export default MyParticlesComboChart;
