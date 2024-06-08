// src/app/components/ParticlesList.js
import React from 'react';
import ParticleChart from './ParticleChart';
import styles from '../page.module.css';

const ParticlesList = ({ particles }) => (
    <div className={styles.particles}>
        <h2>Particles</h2>
        <ParticleChart particles={particles} />
        <ul className={styles.list}>
            {particles.map((particle, index) => (
                <li key={index} className={styles.listItem}>
                    Address: {particle.address}, Position: [{particle.position.join(', ')}]
                </li>
            ))}
        </ul>
    </div>
);

export default ParticlesList;
