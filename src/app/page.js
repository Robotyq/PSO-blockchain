"use client";
import { useState, useEffect } from 'react';
import { useWeb3 } from './components/Web3Provider';
import {
    initializeController,
    fetchParticlesData,
    fetchEventsData
} from './scripts/blockchain';
import styles from './page.module.css';

export default function Home() {
    const { web3, account } = useWeb3();
    const [controller, setController] = useState(null);
    const [particles, setParticles] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const initController = async () => {
        try {
            const controllerInstance = await initializeController(web3);
            setController(controllerInstance);
        } catch (error) {
            setError({ message: error.message, stack: error.stack });
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
                setError({ message: error.message, stack: error.stack });
            }
        }
    };

    const fetchEvents = async () => {
        if (controller) {
            try {
                const eventsData = await fetchEventsData(web3, controller);
                setEvents(eventsData);
                setError(null); // Clear any previous errors
            } catch (error) {
                setError({ message: error.message, stack: error.stack });
            }
        }
    };

    return (
        <main className={styles.main}>
            <h1>Blockchain Particle System</h1>
            {/*<h2>Accounts: {accounts.join(", ")}</h2>*/}
            <h2>Account: {account}</h2>
            <h3>Web3: {web3 ? 'Connected' : 'Not Connected'}</h3>
            <h4>Controller contract: {controller ? controller.options.address : 'Not Initialized'}</h4>
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

            <h2>Particles</h2>
            <ul className={styles.list}>
                {particles.map((particle, index) => (
                    <li key={index} className={styles.listItem}>
                        Address: {particle.address}, Position: [{particle.position.join(', ')}]
                    </li>
                ))}
            </ul>

            <h2>Events</h2>
            <ul className={styles.list}>
                {events.map((event, index) => (
                    <li key={index} className={styles.listItem}>
                        {event.event}: {JSON.stringify(event)}
                        {}
                    </li>
                ))}
            </ul>
        </main>
    );
}
