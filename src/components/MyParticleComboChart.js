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
            const movedEvents = events.filter(event => event.event === 'Moved' && event.particle === selectedParticle);
            console.log("movedEvents: ", movedEvents)
            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))].sort((a, b) => Number(a) - Number(b));
            const myMovedEvents = await Promise.all(
                blocks.map(async block => {
                    const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                    const count = await eventsInBlock.reduce(async (accPromise, event) => {
                        const acc = await accPromise;
                        const transactionDetails = await getTransactionDetails(event.transactionHash);
                        // if (selectedParticle === event.particle &&
                        //     transactionDetails.from.toLowerCase() === account.toLowerCase()) {
                        return acc + 1;
                        // }
                        // return acc;
                    }, Promise.resolve(0));
                    return count;
                })
            );

            const myGasCosts = await Promise.all(
                blocks.map(async block => {
                    const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                    const gasCost = await eventsInBlock.reduce(async (accPromise, event) => {
                        const acc = await accPromise;
                        const transactionDetails = await getTransactionDetails(event.transactionHash);
                        // if (particles.some(particle => particle.address === event.particle) &&
                        //     transactionDetails.from.toLowerCase() === account.toLowerCase()) {
                        return acc + Number(transactionDetails.gasUsed);
                        // }
                        // return acc;
                    }, Promise.resolve(0));
                    return gasCost;
                })
            );

            // Convert gas costs to milliETH
            const myGasCostsInMilliEth = myGasCosts.map(gas => gas * 5 / 1e6);

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Selected Particles\' Iterations',
                        data: myMovedEvents,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1', // Use y1 axis for iterations
                        order: 1, // Draw behind the line
                    },
                    {
                        type: 'line',
                        label: 'Selected Particles\' Gas Cost',
                        data: myGasCostsInMilliEth,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                        yAxisID: 'y2', // Use y2 axis for gas cost
                        order: 2, // Draw on top of the bar
                    },
                ]
            });
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
                    drawOnChartArea: false, // Only draw gridlines on the left y-axis
                },
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

export default MyParticlesComboChart;
