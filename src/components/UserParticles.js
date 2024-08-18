import React from 'react';
import styles from '../page.module.css';

const shortenAddress = (address) => `${address.slice(0, 4)}...${address.slice(-4)}`;

const UserParticles = ({particles, controllersColors}) => {
    return (
        <div>
            <h3>All my Particles</h3>
            <h4>Here are all the particles you have deployed. Same color cards share the target function and the
                controller</h4>
            <br/>
            <div className={styles.cardsContainer}>
                {particles.map((particle, index) => {
                    const controllerColor = controllersColors[particle.controller] || `hsl(${Math.random() * 360}, 100%, 75%)`;
                    return (
                        <div key={index} className={styles.card} style={{backgroundColor: controllerColor}}>
                            <p><strong>Particle Address:</strong> {shortenAddress(particle.address)}</p>
                            <p><strong>Controller:</strong> {shortenAddress(particle.controller)}</p>
                            <p><strong>Target Function:</strong> {shortenAddress(particle.targetFunction)}</p>
                            <p><strong>Current Position:</strong> [{particle.position.join(', ')}]</p>
                            <p><strong>Local Min Position:</strong> [{particle.localBest.join(', ')}]</p>
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default UserParticles;
