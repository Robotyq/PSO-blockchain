import React from 'react';
import {Scatter} from 'react-chartjs-2';
import {CategoryScale, Chart as ChartJS, LinearScale, PointElement, Tooltip} from 'chart.js';
import styles from '../page.module.css';

ChartJS.register(Tooltip, PointElement, LinearScale, CategoryScale);

const ParticlesChart = ({particles, account}) => {
    const data = {
        datasets: particles.map((particle) => ({
            label: particle.name,
            data: [{x: particle.position[0], y: particle.position[1]}],
            backgroundColor: particle.owner === account ? 'rgb(5,61,248)' : 'rgba(75, 192, 192, 1)',
            pointRadius: 8,
        })),
    };

    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
            },
            y: {
                type: 'linear',
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const datasetIndex = context.datasetIndex;
                        const particle = particles[datasetIndex];
                        const name = particle.name.slice(0, 4) + '...' + particle.name.slice(-3)
                        return `${name}: (${particle.position[0]}, ${particle.position[1]}) => ${particle.currentValue}`;
                    },
                },
            },
        },
    };

    return (
        <div className={styles.chartContainer}>
            <Scatter data={data} options={options}/>
        </div>
    );
};

export default ParticlesChart;
