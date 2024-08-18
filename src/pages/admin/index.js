"use client";
import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import AccountInfo from '../../components/AccountInfo';
import ControllerCards from '@/components/ControllerCards';
import DeployControllerForm from '../../components/DeployControllerForm';
import {fetchAllControllerDetails} from "@/scripts/users_scripts";
import styles from '../../page.module.css';

export default function AdminControllerPage() {
    const {web3, account} = useWeb3();
    const [controllers, setControllers] = useState([]);
    const [error, setError] = useState(null);

    const fetchControllers = async () => {
        try {
            const controllersData = await fetchAllControllerDetails(web3);
            const ownedControllers = controllersData.filter(controller => controller.owner === account);
            setControllers(ownedControllers);
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    };

    useEffect(() => {
        if (account) {
            fetchControllers();
        }
    }, [account]);

    return (
        <main className={styles.main}>
            <h1>Admin Controllers</h1>
            <AccountInfo account={account} web3={web3} role={'controller admin'}/>
            <ControllerCards controllers={controllers} owner={account}/>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <DeployControllerForm web3={web3} account={account} onControllerDeployed={fetchControllers}/>

        </main>
    );
}
