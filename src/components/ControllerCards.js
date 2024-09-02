import React from 'react';
import {useRouter} from 'next/router';
import styles from '../page.module.css';
import {shortenAddress} from './UserParticles';

const ControllerCards = ({
                             controllers,
                             selectedController,
                             onSelectController,
                             controllersColors,
                             owner,
                             displayWarning
                         }) => {
    const router = useRouter();

    const handleControllerClick = (controllerAddress) => {
        if (onSelectController) {
            onSelectController(controllerAddress);
        } else {
            router.push({
                pathname: '/overview',
                query: {controllerAddress: controllerAddress}
            });
        }
    };
    let extraIndex = 0;
    return (
        <div>
            {!owner && <h3>All Swarms</h3>}
            {owner && owner !== 'others' && <h3>My Swarms (controllers deployed by me)</h3>}
            {owner && owner === 'others' && <h3>All other Swarm Controllers</h3>}
            {displayWarning && <h4>What swarm do you want your particle to join? You must select one below</h4>}

            {controllers.length === 0 && <h4>No controllers found</h4>}
            <div className={styles.controllerCardsContainer}>
                {controllers.map((controller, index) => {
                    const isSelected = selectedController === controller.address;
                    const controllersColor = controllersColors ? controllersColors[controller.address] : null;
                    console.log("controllersColor", controllersColor)
                    console.log('extraIndex', extraIndex)
                    const cardColor = controllersColor || controllersColors[++extraIndex] || `hsl(${Math.random() * 360}, 100%, 30%)`;

                    return (
                        <div
                            key={index}
                            className={`${styles.controllerCard} ${isSelected ? styles.selectedCard : ''}`}
                            style={{backgroundColor: cardColor}}
                            onClick={() => handleControllerClick(controller.address)}
                        >
                            <h3><strong>optimizing:</strong> {controller.functionName}</h3>
                            <p><strong>Controller Address:</strong> {shortenAddress(controller.address)}</p>
                            <p><strong>Target Function:</strong> {shortenAddress(controller.targetFunctionAddress)}</p>
                            <p><strong>Number of Particles:</strong> {controller.particlesCount}</p>
                            <p><strong>Global Min Position:</strong> [{controller.globalMin.join(', ')}]</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ControllerCards;
