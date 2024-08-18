"use client";
import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import AccountInfo from '../../components/AccountInfo';
import UserParticles from '../../components/UserParticles'; // Add this import
import DeployParticleForm from '../../components/DeployParticleForm'; // Add this import
//import ControllerInfo from '../../components/ControllerInfo';
//import IterationControl from '../../components/IterationControl';
//import GlobalMin from '../../components/GlobalMin';
//import ComboChart from '../../components/ComboChart';
//import ParticlesList from '../../components/ParticlesList';
//import EventsList from '../../components/EventsList';
//import TargetFunctionDetails from '../../components/TarghetFunctionDetails';
//import TargetFunctionSelector from '../../components/TargetFunctionSelector';
import styles from '../../page.module.css';
import {fetchUserParticlesByEvents} from "@/scripts/users_scripts";

export default function Home() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [particles, setParticles] = useState([]);
    const [userParticles, setUserParticles] = useState([]);
    const [controllersColors, setControllersColors] = useState({});
    const [targetFunction, setTargetFunction] = useState('');
    const [error, setError] = useState(null);

    // const initController = async () => {
    //     try {
    //         const controllerInstance = await initializeController(web3);
    //         setController(controllerInstance);
    //     } catch (error) {
    //         setError({message: error.message, stack: error.stack});
    //     }
    // };
    //
    // useEffect(() => {
    //     if (web3) {
    //         initController();
    //     }
    // }, [web3]);

    const fetchUserParticles = async () => {
        if (account) {
            try {
                const userParticlesData = await fetchUserParticlesByEvents(web3, account);
                setUserParticles(userParticlesData);
                const uniqueControllers = [...new Set(userParticlesData.map(particle => particle.controller))];
                const colors = {};
                uniqueControllers.forEach((controller, index) => {
                    colors[controller] = `hsl(${index * (360 / uniqueControllers.length)}, 100%, 30%)`; // Darker colors
                });
                setControllersColors(colors);
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    useEffect(() => {
        if (account) {
            fetchUserParticles();
        }
    }, [account]);

    return (
        <main className={styles.main}>
            <h1>My Particles Tracker</h1>
            <AccountInfo account={account} web3={web3}/>
            <UserParticles particles={userParticles} controllersColors={controllersColors}/> {/* Add this line */}
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <DeployParticleForm
                web3={web3}
                account={account}
                controller={controller}
                onParticleDeployed={fetchUserParticles}
                targetFunction={targetFunction}
            /> {/* Move DeployParticleForm to the end */}
        </main>
    );
}
