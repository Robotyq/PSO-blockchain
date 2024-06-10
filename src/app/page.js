"use client";
import {useState, useEffect} from 'react';
import {useWeb3} from './components/Web3Provider';
import {initializeController, fetchParticlesData, fetchEventsData, iterate} from './scripts/blockchain';
import AccountInfo from './components/AccountInfo';
import ControllerInfo from './components/ControllerInfo';
import ParticlesList from './components/ParticlesList';
import EventsList from './components/EventsList';
import IterationControl from './components/IterationControl';
import TargetFunctionSelector from './components/TargetFunctionSelector';
import styles from './page.module.css';

export default function Home() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null); // State for current block number
    const [particles, setParticles] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const initController = async () => {
        try {
            const controllerInstance = await initializeController(web3);
            setController(controllerInstance);
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    };

    useEffect(() => {
        if (web3) {
            initController();
        }
    }, [web3]);

    useEffect(() => {
        if (controller) {
            fetchParticles();
            fetchEvents();
            fetchCurrentBlock();
        }
    }, [controller]);

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
                const eventsData = await fetchEventsData(web3, controller);
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
                    fetchParticles();
                    fetchEvents();
                    fetchCurrentBlock();
                }
                await iterate(web3, account, controller, value, callback);
                // Optionally, you can fetch particles or events after iteration
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    return (
        <main className={styles.main}>
            <h1>Blockchain Particle Tracker</h1>
            <AccountInfo account={account} web3={web3}/>
            <ControllerInfo controllerAddress={controller?.options.address} currentBlock={currentBlock}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <button className={styles.button} onClick={fetchEvents}>Fetch Events</button>
                <IterationControl onIterate={handleIterate}/>
            </div>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <TargetFunctionSelector web3={web3} account={account} controller={controller}/>
            <ParticlesList particles1={particles}/>
            <EventsList events={events}/>
        </main>
    );
}
