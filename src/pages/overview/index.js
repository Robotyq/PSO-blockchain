"use client";
import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import {fetchEventsData, fetchParticlesData, getTargetFunction, iterate} from '@/scripts/blockchain';
import ControllerInfo from '../../components/ControllerInfo';
import ParticlesList from '../../components/ParticlesList';
import IterationControl from '../../components/IterationControl';
import GlobalMin from '../../components/GlobalMin';
import styles from '../../page.module.css';
import TargetFunctionDetails from '../../components/TarghetFunctionDetails';
import {useRouter} from 'next/router';

import EventsList from '../../components/EventsList';
import TargetFunctionSelector from '../../components/TargetFunctionSelector';
import {initializeControllerFromAddress} from "@/scripts/users_scripts";
import AllIterationsChart from "@/components/AllIterationsChart";

export default function Home() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
    const [owner, setOwner] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [particles, setParticles] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [targetF, setTargetF] = useState('');
    const router = useRouter();
    const {controllerAddress} = router.query;

    const initController = async () => {
        try {
            // console.log("initController...")
            const controllerInstance = await initializeControllerFromAddress(web3, controllerAddress);
            setController(controllerInstance);
            console.log("controller initialized", controllerInstance)
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    };

    useEffect(() => {
        if (web3) {
            initController();
        }
    }, [web3, controllerAddress]);

    async function fetchTarghetFunction() {
        try {
            // console.log("fetchTarghetFunction for controller: ", controller)
            const target = await getTargetFunction(web3, controller);
            setTargetF(target);
            // console.log("targetFunction: ", target)
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    }


    useEffect(() => {
        if (controller) {
            fetchParticles();
            fetchCurrentBlock();
            fetchTarghetFunction();
            fetchOwner();
        }
    }, [controller]);

    useEffect(() => {
        if (controller) {
            fetchEvents();
            fetchParticles();
            fetchTarghetFunction()
        }
    }, [currentBlock]);

    async function fetchOwner() {
        const owner = await controller.methods.owner().call()
        setOwner(owner);
    }

    const fetchCurrentBlock = async () => {
        if (controller) {
            const blockNumber = await web3.eth.getBlockNumber();
            setCurrentBlock(Number(blockNumber));
            // console.log("blockNumber: ", blockNumber)
        }
    };

    const fetchParticles = async () => {
        if (controller) {
            try {
                const particlesData = await fetchParticlesData(web3, controller);
                setParticles(particlesData);
                // console.log("particlesData: ", particlesData)
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
            <h1>Controller overview</h1>
            <h3>Owner: {owner} {account === owner ? '(me)' : '(somone else)'}</h3>

            {/*<AccountInfo account={account} web3={web3}/>*/}
            <ControllerInfo controllerAddress={controller?.options.address} currentBlock={currentBlock}
                            targetFunctionName={targetF.printName}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <button className={styles.button} onClick={fetchEvents}>Fetch Events</button>
                <IterationControl onIterate={handleIterate}/>
                <TargetFunctionSelector web3={web3} account={account} controller={controller}
                                        afterChange={fetchCurrentBlock} owner={owner}/>
            </div>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <div className={styles.flex_layout}>
                <div className={styles.chartContainer}>
                    <ParticlesList particles1={particles} controller={controller}/>
                </div>
                <div className={styles.detailsContainer}>
                    <GlobalMin controller={controller} blockNumber={currentBlock}/>
                    <TargetFunctionDetails targetFunction={targetF}/>
                </div>
            </div>
            <br/>
            <br/>
            <h2>Results</h2>
            <br/>
            <h4>Iterations per block</h4>
            <AllIterationsChart controller={controller} particles={particles} web3={web3}/>
            <br/>
            <br/>
            <h4>Gas Cost</h4>

            <EventsList events={events}/>
        </main>
    );
}
