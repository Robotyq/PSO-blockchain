// src/app/components/ParticlesChart.js
import React from 'react';
import {Scatter} from 'react-chartjs-2';
import {Chart as ChartJS, Tooltip, PointElement, LinearScale, CategoryScale} from 'chart.js';
import styles from '../page.module.css';
ChartJS.register(Tooltip, PointElement, LinearScale, CategoryScale);

const ParticlesChart = ({particles}) => {
    const data = {
        datasets: particles.map((particle) => ({
            label: particle.name,
            data: [{x: particle.position[0], y: particle.position[1]}],
            backgroundColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 8,  // Increase the dot size
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
                display: false,  // Hide the legend
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const particle = particles[context.dataIndex];
                        return `${particle.name}: (${particle.position[0]}, ${particle.position[1]})`;
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
