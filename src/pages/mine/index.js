"use client";
import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import {fetchParticlesData, getTargetFunction, initializeController, iterateParticle} from '@/scripts/blockchain';
import AccountInfo from '../../components/AccountInfo';
import ControllerInfo from '../../components/ControllerInfo';
import ParticlesList from '../../components/ParticlesList';
import IterationControl from '../../components/IterationControl';
import GlobalMin from '../../components/GlobalMin';
import styles from '../../page.module.css';
import ComboChart from '../../components/ComboChart';

import DeployParticleForm from '../../components/DeployParticleForm';
import IterationsComboChart from "@/components/MyIterationsChart";

export default function Home() {
    const {web3, account} = useWeb3();
    const [controller, setController] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [particles, setParticles] = useState([]);
    const [userParticles, setUserParticles] = useState([]);
    const [targetFunction, setTargetFunction] = useState('');
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
            fetchParticles();
            fetchTarghetFunction();
        }
    }, [currentBlock]);

    const fetchCurrentBlock = async () => {
        if (controller) {
            const blockNumber = await web3.eth.getBlockNumber();
            console.log("old block number", currentBlock);
            const newBlockNumber = Number(blockNumber);
            console.log("new block number", newBlockNumber);
            setCurrentBlock(newBlockNumber);
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
                    });
                }
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    const handleParticleDeployed = () => {
        fetchParticles();
        fetchCurrentBlock();
    };

    return (
        <main className={styles.main}>
            <h1>My Particles Tracker</h1>
            <AccountInfo account={account} web3={web3}/>
            <ControllerInfo controllerAddress={controller?.options.address} currentBlock={currentBlock}
                            targetFunction={targetFunction}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <IterationControl onIterate={handleIterate}/>
                <DeployParticleForm
                    web3={web3}
                    account={account}
                    controller={controller}
                    onParticleDeployed={handleParticleDeployed}
                /></div>
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
            <div className={styles.flex_layout}>
                <div className={styles.chartContainer}>
                    <ParticlesList particles1={particles} account={account}/>

                    <ComboChart web3={web3} account={account} controller={controller} particles={userParticles}
                                currentBlock={currentBlock}/>
                    <IterationsComboChart web3={web3} controller={controller} account={account}
                                          currentBlock={currentBlock} particles={userParticles}/>
                    {/*<GasCostChart web3={web3} controller={controller} account={account}*/}
                    {/*              currentBlock={currentBlock} particles={userParticles}/>*/}

                </div>
                <div className={styles.detailsContainer}>
                    <GlobalMin controller={controller} blockNumber={currentBlock}/>
                    {/*<TargetFunctionDetails targetFunction={targetFunction}/>*/}
                </div>
            </div>
        </main>
    );
}
