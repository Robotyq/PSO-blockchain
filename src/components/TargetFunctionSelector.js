import React, {useEffect, useState} from 'react';
import {fetchDeployedFunctions, updateTargetFunction} from '@/scripts/blockchain';
import styles from '../page.module.css';
// import iterationControl from "@/src/components/IterationControl";

export const functionNames = {
    'd66': 'Rastrigin',
    'e23': 'Rosenbrock',
    '497': 'Sphere Function'
};

const TargetFunctionSelector = ({web3, account, controller, afterChange}) => {
    const [deployedFunctions, setDeployedFunctions] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');
    useEffect(() => {
        const fetchFunctions = async () => {
            try {
                const functions = await fetchDeployedFunctions(web3);

                let unknownCount = 1;
                const namedFunctions = functions.map(func => {
                    const lastThree = func.address.slice(-3);
                    const name = functionNames[lastThree] || `Unnamed F${unknownCount++}`;
                    return {...func, name};
                });
                setDeployedFunctions(namedFunctions);
            } catch (error) {
                console.error('Error fetching deployed functions:', error);
            }
        };

        if (web3) {
            fetchFunctions();
        }
    }, [web3]);

    const handleUpdate = async () => {
        if (selectedFunction) {
            try {
                await updateTargetFunction(account, controller, selectedFunction);
                if (afterChange) {
                    afterChange();
                }
            } catch (error) {
                alert(`Error updating target function: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.iterationControl}>
            <select value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className={styles.dropdown}
            >
                <option value="">Select Target Function</option>
                {deployedFunctions.map((func, index) => (
                    <option key={index} value={func.address}>
                        {func.name} ({func.address.slice(0, 4)}...{func.address.slice(-3)})
                    </option>
                ))}
            </select>
            <button className={styles.button_gas} onClick={handleUpdate}>
                Update Target Function
            </button>
        </div>
    );
};

export default TargetFunctionSelector;
