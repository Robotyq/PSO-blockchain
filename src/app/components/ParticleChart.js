// src/app/components/ParticleChart.js
import React, { useEffect, useRef } from 'react';

const ParticleChart = ({ particles }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw all particle positions
        particles.forEach((particle) => {
            const [x, y] = particle.position.map(coord => Number(coord) + 100); // Adjust positions to fit the canvas
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }, [particles]);

    return <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid #ccc' }}></canvas>;
};

export default ParticleChart;
