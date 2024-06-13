import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import styles from '../page.module.css';
import {fetchGlobalMin} from '@/scripts/blockchain';

const ComboChart = ({web3, account, controller, particles, currentBlock}) => {
    const [dataSets, setDataSets] = useState([]);
    const [globalMin, setGlobalMin] = useState(null);

    const fetchMin = async () => {
        if (controller) {
            try {
                const min = await fetchGlobalMin(controller);
                setGlobalMin(min);
            } catch (error) {
                console.error('Error fetching global minimum:', error);
            }
        }
    };

    useEffect(() => {
        if (controller) {
            fetchMin();
        }
    }, [controller, currentBlock]);

    useEffect(() => {
        if (particles && globalMin) {
            console.log('Updating chart data', particles, globalMin);
            const newDataSets = {
                labels: dataSets.length ? [...dataSets[0].labels, `Iteration ${dataSets[0].labels.length + 1}`] : ['Iteration 1'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Current Value',
                        data: particles.map(p => Number(p.position[2])),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        type: 'line',
                        label: 'Global Minimum',
                        data: dataSets.length ? [...dataSets[1].data, Number(globalMin[2])] : [Number(globalMin[2])],
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                    },
                ],
            };
            setDataSets(newDataSets);
            console.log('Updated chart data', newDataSets)
        }
    }, [particles, globalMin]);

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className={styles.chartContainer}>
            {dataSets.length > 0 && <Bar data={dataSets} options={options}/>}
            {/*<Bar data={dataSets} options={options} />*/}
        </div>
    );
};

export default ComboChart;
