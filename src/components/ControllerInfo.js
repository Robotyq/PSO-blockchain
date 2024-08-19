import React from 'react';
import styles from '../page.module.css';

const ControllerInfo = ({controllerAddress, currentBlock, targetFunctionName}) => {
    return (
        <div className={styles.controllerInfo}>
            <div>
                <h3>Controller Address</h3>
                <p>{controllerAddress}</p>
            </div>
            <div>
                <h3>Current Block</h3>
                <p>{currentBlock}</p>
            </div>
            <div className={styles.targetFunction}>
                <h3>Target Function</h3>
                <p>{targetFunctionName}</p>
            </div>
        </div>
    );
};

export default ControllerInfo;
