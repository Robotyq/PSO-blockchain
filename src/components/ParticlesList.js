import React from 'react';
import ParticlesChart from './ParticlesChart';
import styles from '../page.module.css';

const ParticlesList = ({particles1, account, selectedParticle}) => {
    if (!particles1) {
        return null;
    }
    console.log("particles1", particles1)
    const particles = particles1.map(p => ({
        name: p.address,
        position: [Number(p.position[0]), Number(p.position[1])],
        currentValue: Number(p.position[2]),
        localBest: [Number(p.localBest[0]), Number(p.localBest[1]), Number(p.localBest[2])],
        owner: p.owner,
        speed: p.speed
    }));

    return (
        <div className={styles.particles}>
            <div className={styles.flex_layout}>
                <h2>Particles</h2>
                <ParticlesChart particles={particles} account={account} selectedParticle={selectedParticle}/>
            </div>
            <p>All particles:</p>
            <ul className={styles.list}>
                {particles.map((particle, index) => (
                    <li key={index} className={styles.listItem}>
                        Particle address: {particle.name}, Current Value: {particle.currentValue}, Position:
                        [{particle.position.join(", ")}], Local Best:
                        [{particle.localBest.join(", ")}], Owner
                        <span className={particle.owner === account ? styles.blueText : null}>
            : {particle.owner.slice(0, 6)}...{particle.owner.slice(-4)}
                            {particle.owner === account ? " (me)" : " (someone else)"}
        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParticlesList;
