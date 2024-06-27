import React from 'react';
import {Scatter} from 'react-chartjs-2';
import {CategoryScale, Chart as ChartJS, LinearScale, PointElement, Tooltip} from 'chart.js';
import styles from '../page.module.css';

ChartJS.register(Tooltip, PointElement, LinearScale, CategoryScale);

const ParticlesChart = ({particles, account}) => {
    const data = {
        datasets: particles.map((particle) => {
            let backgroundColor
            if (account) {
                backgroundColor = particle.owner === account ? 'rgb(5,61,248)' : 'rgba(75, 192, 192, 1)';
            } else {
                // console.log("particle",particle)
                const localBestElement = Number(particle.localBest[2]);
                const positionElement = Number(particle.currentValue);
                let diff = (positionElement - localBestElement) / localBestElement;
                diff = Number(diff.toFixed(2))
                const red = 255 * diff
                const green = 255 - red;
                backgroundColor = `rgb(${red}, ${green}, 192)`;
                // console.log("diff",diff)
                // console.log("red",red)
                // console.log("blue",blue)
            }
            return ({
                label: particle.name,
                data: [{x: particle.position[0], y: particle.position[1]}],
                backgroundColor: backgroundColor,
                pointRadius: 13,
            });
        }),
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
                        return [
                            `${name}: (${particle.position[0]}, ${particle.position[1]}) => ${particle.currentValue}`,
                            `Local Best: (${particle.localBest[0]}, ${particle.localBest[1]}) => ${particle.localBest[2]}`,
                            `Speed: (${particle.speed[0]}, ${particle.speed[1]})`
                        ];
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
