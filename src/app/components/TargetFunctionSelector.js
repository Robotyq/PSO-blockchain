import React, { useState } from 'react';
import { updateTargetFunction } from '../scripts/blockchain';
import styles from '../page.module.css';

const TargetFunctionSelector = ({account, controller }) => {
    const [selectedFunction, setSelectedFunction] = useState('');

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
                <option value="Rastrigin">Rastrigin</option>
                <option value="Rosenbrock">Rosenbrock</option>
                <option value="Sphere">Sphere</option>
                <option value="Trigonometry">Trigonometry</option>
            </select>
            <button className={styles.button} onClick={handleUpdate}>
                Update Target Function
            </button>
        </div>
    );
};

export default TargetFunctionSelector;
