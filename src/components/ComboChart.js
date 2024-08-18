import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../page.module.css';
import {fetchEventsData} from '@/scripts/blockchain';

const ComboChart = ({controller, currentBlock = 0, web3, particles, account, selectedParticle}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [events, setEvents] = useState([]);
    const [globalMin, setGlobalMin] = useState(null);

    const fetchEvents = async () => {
        if (controller && currentBlock !== null) {
            try {
                const eventsData = await fetchEventsData(web3, controller, 0);
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
            let labels = [];
            let newDatasets = [];
            let lastGlobalMin = globalMin;
            let globalMinSet = [];
            events.forEach(event => {
                if (event.event === 'Moved' && event.particle === selectedParticle) {
                    // let isMine = false;
                    // isMine= event.particle === selectedParticle;
                    // for (let i = 0; i < particles.length; i++) {
                    //     if (particles[i].address === event.particle) {
                    //         isMine = true;
                    //         break;
                    //     }
                    // }
                    // if (!isMine) {
                    //     return;
                    // }
                    labels.push(`Block ${event.blockNumber}`);
                    const particleData = Number(event.newValue);
                    const existingDataset = newDatasets.find(dataset => dataset.label === `Particle ${event.particle}`);
                    if (existingDataset) {
                        existingDataset.data.push(particleData);
                    } else {
                        newDatasets.push({
                            type: 'bar',
                            label: `Particle ${event.particle}`,
                            data: [particleData],
                            backgroundColor: `rgba(${15 + newDatasets.length * 120}, 192, 192, 0.5)`,
                            borderColor: `rgba(${15 + newDatasets.length * 120}, 192, 192, 1)`,
                            borderWidth: 5,
                        });
                    }
                } else if (event.event === 'NewBestGlobal') {
                    lastGlobalMin = event.newValue.map(val => Number(val));
                    if (lastGlobalMin[2] > 10000000000000) {
                        lastGlobalMin = lastGlobalMin.map(val => val / 1000000000000000000);
                    }
                } else if (event.event === 'TargetFunctionUpdated') {
                    labels = [];
                    newDatasets = [];
                    lastGlobalMin = null;
                    globalMinSet = [];
                    setChartData({
                        labels: [],
                        datasets: [],
                    });
                }
                if (labels.length > globalMinSet.length + 1 && lastGlobalMin) {
                    globalMinSet.push(lastGlobalMin[2]);
                }
            });
            if (lastGlobalMin && lastGlobalMin.length !== 0)
                globalMinSet.push(lastGlobalMin[2]);
            newDatasets.push({
                type: 'line',
                label: 'Global Minimum',
                data: globalMinSet,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
            });
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
                type: 'logarithmic',
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
