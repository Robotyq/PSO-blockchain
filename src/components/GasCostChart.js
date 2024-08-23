import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const TotalGasCostChart = ({web3, controller}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [totalGasUsed, setTotalGasUsed] = useState(0);

    useEffect(() => {
        if (controller) {
            fetchEvents();
        }
    }, [controller]);

    const fetchEvents = async () => {
        const getTransactionDetails = async (transactionHash) => {
            const receipt = await web3.eth.getTransactionReceipt(transactionHash);
            return {
                gasUsed: receipt.gasUsed
            };
        };

        try {
            const events = await fetchEventsData(web3, controller, 0);
            const movedEvents = events.filter(event => event.event === 'Moved');
            const blocks = [...new Set(movedEvents.map(event => event.blockNumber))].sort((a, b) => Number(a) - Number(b));

            const gasCosts = await Promise.all(
                blocks.map(async block => {
                    const eventsInBlock = movedEvents.filter(event => event.blockNumber === block);
                    const gasCost = await eventsInBlock.reduce(async (accPromise, event) => {
                        const acc = await accPromise;
                        const transactionDetails = await getTransactionDetails(event.transactionHash);
                        return acc + Number(transactionDetails.gasUsed);
                    }, Promise.resolve(0));
                    return gasCost;
                })
            );

            // Convert gas costs to ETH
            const gasCostsInEth = gasCosts.map(gas => gas * 5 / 1e6);
            let totalGasUsedInEth = gasCostsInEth.reduce((acc, gas) => acc + gas, 0);
            totalGasUsedInEth /= 1000;

            setChartData({
                labels: blocks.map(block => `Block ${block}`),
                datasets: [
                    {
                        type: 'line',
                        label: 'Gas Cost',
                        data: gasCostsInEth,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
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
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Gas Used (miliETH)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Blocks',
                },
            },
        },
    };

    return (
        <div className={styles.chartContainerWithCard}>
            <div className={styles.chartWrapper}>
                {chartData.labels.length > 0 && (
                    <Line data={chartData} options={options}/>
                )}
            </div>
            <div className={styles.totalGasCard}>
                <h3>Total Gas</h3>
                <h4>{totalGasUsed.toFixed(6)} ETH</h4>
                <p>Total Gas Used by PSO</p>
            </div>
        </div>
    );
};

export default TotalGasCostChart;
