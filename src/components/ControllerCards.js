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

    return (
        <div>
            {!owner && <h3>All Controllers</h3>}
            {owner && owner !== 'others' && <h3>My Controllers (deployed by me)</h3>}
            {owner && owner === 'others' && <h3>All other Controllers</h3>}
            {displayWarning && <h4>You must select one in order to deploy a new particle on it</h4>}

            {controllers.length === 0 && <h4>No controllers found</h4>}
            <div className={styles.controllerCardsContainer}>
                {controllers.map((controller, index) => {
                    const isSelected = selectedController === controller.address;
                    const controllersColor = controllersColors ? controllersColors[controller.address] : null;
                    const cardColor = controllersColor || `hsl(${Math.random() * 360}, 100%, 30%)`;

                    return (
                        <div
                            key={index}
                            className={`${styles.controllerCard} ${isSelected ? styles.selectedCard : ''}`}
                            style={{backgroundColor: cardColor}}
                            onClick={() => handleControllerClick(controller.address)}
                        >
                            <h3><strong>Function Name:</strong> {controller.functionName}</h3>
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
