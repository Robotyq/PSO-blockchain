import {useEffect, useState} from 'react';
import styles from '../page.module.css';
import {deployController, fetchDeployedFunctions} from '@/scripts/blockchain';

const DeployControllerForm = ({web3, account, onControllerDeployed}) => {
    const [targetFunctions, setTargetFunctions] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFunctions = async () => {
            try {
                const functions = await fetchDeployedFunctions(web3);
                setTargetFunctions(functions);
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        };

        if (web3) {
            fetchFunctions();
        }
    }, [web3]);

    const handleDeploy = async () => {
        if (!selectedFunction) {
            setError({message: 'Please select a target function'});
            return;
        }

        try {
            await deployController(web3, account, selectedFunction);
            onControllerDeployed(); // Callback to refresh controllers list
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    };

    return (
        <div className={styles.deployForm}>
            <br/>
            <br/>
            <br/>
            <br/>
            <h2>Deploy New Controller</h2><br/>
            <div>
                <label>Select Target Function:</label>
                <select value={selectedFunction} onChange={(e) => setSelectedFunction(e.target.value)}>
                    <option value="">-- Select a function --</option>
                    {targetFunctions.map((func) => (
                        <option key={func.address} value={func.address}>
                            {func.name} ({func.address})
                        </option>
                    ))}
                </select>
            </div>
            <br/>
            <button className={styles.button_gas} onClick={handleDeploy}>
                Deploy Controller
            </button>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
        </div>
    );
};

export default DeployControllerForm;
