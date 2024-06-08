// src/app/components/ParticlesChart.js
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

ChartJS.register(Tooltip, Legend, PointElement, LinearScale, Title, CategoryScale);

const ParticlesChart = ({ particles }) => {
    const data = {
        datasets: particles.map((particle, index) => ({
            label: particle.name,
            data: [{ x: particle.position[0], y: particle.position[1] }],
            backgroundColor: 'rgba(75, 192, 192, 1)',
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

    return <Scatter data={data} options={options} />;
};

export default ParticlesChart;
