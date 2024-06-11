// src/app/components/ParticlesList.js
import React from 'react';
import ParticlesChart from './ParticlesChart';
import styles from '../page.module.css';

const ParticlesList = ({particles1}) => {
    if (!particles1) {
        console.log("particles1 is null")
        console.log("particles1: ", particles1)
        return null;
    }
    const particles = [];
    for (let i = 0; i < particles1.length; i++) {
        let particle = {};
        particle.name = particles1[i].address;
        let xyposition = [];
        xyposition[0] = Number(particles1[i].position[0]);
        xyposition[1] = Number(particles1[i].position[1]);
        particle.position = xyposition;

        let xylocalBest = [];
        xylocalBest[0] = Number(particles1[i].localBest[0]);
        xylocalBest[1] = Number(particles1[i].localBest[1]);
        xylocalBest[2] = Number(particles1[i].localBest[2]);
        particle.localBest = xylocalBest;
        particles.push(particle);
    }

    return (
        <div className={styles.particles}>
            <h2>Particles</h2>
            <ParticlesChart particles={particles}/>
            <ul className={styles.list}>
                {particles.map((particle, index) => {
                    return (
                        <li key={index} className={styles.listItem}>
                            Particle address: {particle.name}, Position: [{particle.position.join(", ")}], Local Best: [{particle.localBest.join(", ")}]
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ParticlesList;
