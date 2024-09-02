import React from 'react';
import {useRouter} from 'next/router';
import styles from '../page.module.css';

export const shortenAddress = (address) => `${address.slice(0, 4)}...${address.slice(-4)}`;

const UserParticles = ({particles, controllersColors}) => {
    const router = useRouter();

    const handleCardClick = (particle) => {
        router.push({
            pathname: `/particle/${particle.address}`,
            query: {particle: JSON.stringify(particle)}, // Pass particle data as a query parameter
        }, undefined, {shallow: true});
    };
    console.log("controlerColors", controllersColors)
    let extraColorIndex = 0;
    return (
        <div>
            <h3>All my Particles</h3>
            <h4>Here are all the particles you have deployed. Same color particles are in the same swarm and thus share
                the target function and the
                controller</h4>
            <br/>
            <div className={styles.cardsContainer}>
                {particles.map((particle, index) => {
                    const extraIndex = (++extraColorIndex) % 2;
                    const controllerColor = controllersColors[particle.controller] || controllersColors[extraIndex] || `hsl(${Math.random() * 360}, 100%, 75%)`;
                    return (
                        <div
                            key={index}
                            className={styles.card}
                            style={{backgroundColor: controllerColor}}
                            onClick={() => handleCardClick(particle)}
                            // onClick={() => handleClick(particle)}
                        >
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
