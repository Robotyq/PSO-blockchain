"use client";
import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import {fetchParticlesData, initializeController, iterateParticle} from '@/scripts/blockchain';
import AccountInfo from '../../components/AccountInfo';
import ControllerInfo from '../../components/ControllerInfo';
import ParticlesList from '../../components/ParticlesList';
import IterationControl from '../../components/IterationControl';
import GlobalMin from '../../components/GlobalMin';
import styles from '../../page.module.css';

export default function Client() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [particles, setParticles] = useState([]);
    const [userParticles, setUserParticles] = useState([]);
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
            fetchCurrentBlock();
        }
    }, [controller]);

    const fetchCurrentBlock = async () => {
        if (controller) {
            const blockNumber = await web3.eth.getBlockNumber();
            setCurrentBlock(Number(blockNumber));
        }
    };

    const fetchParticles = async () => {
        if (controller) {
            try {
                const particlesData = await fetchParticlesData(web3, controller);
                setParticles(particlesData);
                const userParticlesData = particlesData.filter(particle => particle.owner === account);
                setUserParticles(userParticlesData);
                setError(null);
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    const handleIterate = async (value) => {
        if (controller) {
            try {
                for (const particle of userParticles) {
                    iterateParticle(web3, account, particle.address, value, () => {
                        fetchCurrentBlock();
                        fetchParticles()
                    });
                }
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    return (
        <main className={styles.main}>
            <h1>My Particles Tracker</h1>
            <AccountInfo account={account} web3={web3}/>
            <ControllerInfo controllerAddress={controller?.options.address} currentBlock={currentBlock}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <IterationControl onIterate={handleIterate}/>
            </div>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <div className={styles.flex_layout}>
                <div className={styles.chartContainer}>
                    <ParticlesList particles1={particles} account={account}/>
                </div>
                <GlobalMin controller={controller} blockNumber={currentBlock}/>
            </div>
        </main>
    );
}
