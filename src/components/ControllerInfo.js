import React from 'react';
import styles from '../page.module.css';
import {functionNames} from "@/components/TargetFunctionSelector";

const ControllerInfo = ({controllerAddress, currentBlock, targetFunction}) => {
    targetFunction = targetFunction.toString().toLowerCase();
    // console.log(targetFunction, "targetFunction")
    const lastThree = targetFunction.slice(-3);
    const firstThree = targetFunction.slice(0, 4);
    const targetFunctionName = (functionNames[lastThree] || "Unnamed F") + " " + firstThree + "..." + targetFunction.slice(-3);
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
