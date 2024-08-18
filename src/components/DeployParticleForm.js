import React, {useEffect, useState} from 'react';
import {deployParticle} from '@/scripts/blockchain';
import styles from '../page.module.css';

const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const DeployParticleForm = ({web3, account, controller, onParticleDeployed}) => {
    const [initialPosition, setInitialPosition] = useState({x: 0, y: 0});
    const [initialSpeed, setInitialSpeed] = useState({vx: 0, vy: 0});
    const [deployError, setDeployError] = useState(null);

    useEffect(() => {
        setInitialPosition({x: getRandomValue(-500, 500), y: getRandomValue(-500, 500)});
        // setInitialSpeed({vx: getRandomValue(-50, 50), vy: getRandomValue(-50, 50)});
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name in initialPosition) {
            setInitialPosition({...initialPosition, [name]: value});
        } else if (name in initialSpeed) {
            setInitialSpeed({...initialSpeed, [name]: value});
        }
    };

    const handleDeploy = async () => {
        try {
            await deployParticle(web3, account, controller, initialPosition, initialSpeed);
            onParticleDeployed();
        } catch (error) {
            setDeployError({message: error.message, stack: error.stack});
        }
    };

    return (
        <div className={styles.deployForm}>
            <h2>Deploy New Particle</h2>
            <div>
                <label>Initial Position (x, y):</label>
                <input
                    type="number"
                    name="x"
                    value={initialPosition.x}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="y"
                    value={initialPosition.y}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Initial Speed (vx, vy):</label>
                <input
                    type="number"
                    name="vx"
                    value={initialSpeed.vx}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="vy"
                    value={initialSpeed.vy}
                    onChange={handleInputChange}
                />
                <button
                    className={styles.button_gas}
                    onClick={handleDeploy}
                    disabled={!controller}
                    style={!controller ? {backgroundColor: 'gray'} : {}}
                >
                    Deploy Particle
                </button>

            </div>
            {deployError && (
                <div className={styles.error}>
                    <p>{deployError.message}</p>
                    <pre>{deployError.stack}</pre>
                </div>
            )}
        </div>
    );
};

export default DeployParticleForm;
