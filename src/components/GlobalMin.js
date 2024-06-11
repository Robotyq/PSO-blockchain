import React, {useEffect, useState} from 'react';
import {fetchGlobalMin} from '@/scripts/blockchain';
import styles from './GlobalMin.module.css';

const GlobalMin = ({controller, blockNumber}) => {
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
    }, [controller, blockNumber]);

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
                    <p>Position: [{globalMin.slice(0, 2).join(', ')}]</p>
                    <p>Value: {globalMin.slice(-1).join(", ")}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button className={styles.button} onClick={fetchMin}>Refresh</button>
        </div>
    );
};

export default GlobalMin;
