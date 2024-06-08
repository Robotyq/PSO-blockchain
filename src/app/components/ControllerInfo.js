// src/app/components/ControllerInfo.js
import React from 'react';
import styles from '../page.module.css';

const ControllerInfo = ({ controllerAddress, currentBlock }) => (
    <div className={styles.info}>
        {controllerAddress && <p>Controller Contract Address: {controllerAddress}</p>}
        {currentBlock !== null && <p>Current Block Number: {currentBlock}</p>}
    </div>
);

export default ControllerInfo;
