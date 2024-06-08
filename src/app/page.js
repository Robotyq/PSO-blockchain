"use client";
import {useState, useEffect} from 'react';
import {useWeb3} from './components/Web3Provider';
import {initializeController, fetchParticlesData, fetchEventsData} from './scripts/blockchain';
import AccountInfo from './components/AccountInfo';
import ControllerInfo from './components/ControllerInfo';
import ParticlesList from './components/ParticlesList';
import EventsList from './components/EventsList';
import styles from './page.module.css';

export default function Home() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
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

    const fetchParticles = async () => {
        if (controller) {
            try {
                const particlesData = await fetchParticlesData(web3, controller);
                setParticles(particlesData);
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

    return (
        <main className={styles.main}>
            <h1>Blockchain Particle System</h1>
            <AccountInfo account={account} web3={web3}/>
            <ControllerInfo controllerAddress={controller?.options.address}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <button className={styles.button} onClick={fetchEvents}>Fetch Events</button>
            </div>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <ParticlesList particles={particles}/>
            <EventsList events={events}/>
        </main>
    );
}
