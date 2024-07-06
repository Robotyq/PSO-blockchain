"use client";
import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import {
    fetchEventsData,
    fetchParticlesData,
    getTargetFunction,
    initializeController,
    iterate
} from '@/scripts/blockchain';
import AccountInfo from '../../components/AccountInfo';
import ControllerInfo from '../../components/ControllerInfo';
import ParticlesList from '../../components/ParticlesList';
import IterationControl from '../../components/IterationControl';
import GlobalMin from '../../components/GlobalMin';
import styles from '../../page.module.css';
import TargetFunctionDetails from '../../components/TarghetFunctionDetails';

import EventsList from '../../components/EventsList';
import TargetFunctionSelector from '../../components/TargetFunctionSelector';

export default function Home() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [particles, setParticles] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [targetFunction, setTargetFunction] = useState('');

    const initController = async () => {
        try {
            console.log("initController...")
            const controllerInstance = await initializeController(web3);
            setController(controllerInstance);
            console.log("controller initialized")
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    };

    useEffect(() => {
        if (web3) {
            initController();
        }
    }, [web3]);

    async function fetchTarghetFunction() {
        try {
            const targetFunctionAddress = await getTargetFunction(controller);
            setTargetFunction(targetFunctionAddress);
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    }

    useEffect(() => {
        if (controller) {
            fetchParticles();
            fetchCurrentBlock();
            fetchTarghetFunction();
        }
    }, [controller]);

    useEffect(() => {
        if (controller) {
            fetchEvents();
            fetchParticles();
            fetchTarghetFunction()
        }
    }, [currentBlock]);

    const fetchCurrentBlock = async () => {
        if (controller) {
            const blockNumber = await web3.eth.getBlockNumber();
            setCurrentBlock(Number(blockNumber));
            console.log("blockNumber: ", blockNumber)
        }
    };

    const fetchParticles = async () => {
        if (controller) {
            try {
                const particlesData = await fetchParticlesData(web3, controller);
                setParticles(particlesData);
                console.log("particlesData: ", particlesData)
                setError(null); // Clear any previous errors
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    const fetchEvents = async () => {
        if (controller) {
            try {
                const fromBlock = Math.max(currentBlock - 5, 0);
                const eventsData = await fetchEventsData(web3, controller, fromBlock);
                setEvents(eventsData);
                setError(null); // Clear any previous errors
                if (eventsData.length === 0) {
                    setError({message: 'No events found', stack: ''});
                }
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    const handleIterate = async (value) => {
        if (controller) {
            try {
                const callback = () => {
                    fetchCurrentBlock();
                }
                iterate(account, controller, value, callback);
            } catch (error) {
                setError({message: error.message});
            }
        }
    };

    return (
        <main className={styles.main}>
            <h1>Blockchain Particle Swarm Tracker</h1>
            <AccountInfo account={account} web3={web3}/>
            <ControllerInfo controllerAddress={controller?.options.address} currentBlock={currentBlock}
                            targetFunction={targetFunction}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <button className={styles.button} onClick={fetchEvents}>Fetch Events</button>
                <IterationControl onIterate={handleIterate}/>
                <TargetFunctionSelector web3={web3} account={account} controller={controller}
                                        afterChange={fetchCurrentBlock} initialFunc={targetFunction}/>
            </div>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <div className={styles.flex_layout}>
                <div className={styles.chartContainer}>
                    <ParticlesList particles1={particles}/>
                </div>
                <div className={styles.detailsContainer}>
                    <GlobalMin controller={controller} blockNumber={currentBlock}/>
                    <TargetFunctionDetails targetFunction={targetFunction}/>
                </div>
            </div>
            <EventsList events={events}/>
        </main>
    );
}
