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

    useEffect(() => {
        if (web3) {
            const initController = async () => {
                try {
                    const controllerInstance = await initializeController(web3);
                    setController(controllerInstance);
                } catch (error) {
                    console.error(error.message);
                }
            };
            initController();
        }
    }, [web3]);

    const fetchParticles = async () => {
        if (controller) {
            try {
                const particlesData = await fetchParticlesData(web3, controller);
                setParticles(particlesData);
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    const fetchEvents = async () => {
        if (controller) {
            try {
                const eventsData = await fetchEventsData(web3, controller);
                setEvents(eventsData);
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    return (
        <main className={styles.main}>
            <h1>Blockchain Particle System</h1>
            <p>Account: {account}</p>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <button className={styles.button} onClick={fetchEvents}>Fetch Events</button>
            </div>

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
                        {event.event}: {JSON.stringify(event.returnValues)}
                    </li>
                ))}
            </ul>
        </main>
    );
}
