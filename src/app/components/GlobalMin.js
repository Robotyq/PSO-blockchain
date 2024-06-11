import React, {useState, useEffect} from 'react';
import {fetchGlobalMin} from '../scripts/blockchain';
import styles from './GlobalMin.module.css';

const GlobalMin = ({web3, controller}) => {
    const [globalMin, setGlobalMin] = useState(null);
    const [error, setError] = useState(null);

    const fetchMin = async () => {
        if (controller) {
            try {
                const min = await fetchGlobalMin(controller);
                setGlobalMin(min);
                setError(null); // Clear any previous errors
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    useEffect(() => {
        if (controller)
            fetchMin();
    }, [controller]);

    return (
        <div className={styles.globalMinContainer}>
            <h2>Global Minimum</h2>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            {globalMin ? (
                <div>
                    <p>Position: [{globalMin.slice(0, -1).join(', ')}]</p>
                    <p>Value: {globalMin[globalMin.length - 1]}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button className={styles.button} onClick={fetchMin}>Refresh</button>
        </div>
    );
};

export default GlobalMin;
