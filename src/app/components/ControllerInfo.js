import React from 'react';
import styles from '../page.module.css';

const ControllerInfo = ({controllerAddress}) => (
    <div className={styles.info}>
        {controllerAddress && <p>Controller Contract Address: {controllerAddress}</p>}
    </div>
);

export default ControllerInfo;
