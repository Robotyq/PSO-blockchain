import React, {useState, useEffect} from 'react';
import {updateTargetFunction, fetchDeployedFunctions} from '../scripts/blockchain';
import styles from '../page.module.css';

const TargetFunctionSelector = ({web3, account, controller}) => {
    const [deployedFunctions, setDeployedFunctions] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');

    useEffect(() => {
        const fetchFunctions = async () => {
            try {
                const functions = await fetchDeployedFunctions(web3);
                setDeployedFunctions(functions);
                console.log('Fetched deployed functions:', functions);
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
                alert('Target function updated successfully!');
            } catch (error) {
                alert(`Error updating target function: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.center}>
            <select
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
                className={styles.dropdown}
            >
                <option value="">Select Target Function</option>
                {deployedFunctions.map((func, index) => (
                    <option key={index} value={func.address}>
                        {func.address}
                    </option>
                ))}
            </select>
            <button className={styles.button} onClick={handleUpdate}>
                Update Target Function
            </button>
        </div>
    );
};

export default TargetFunctionSelector;
