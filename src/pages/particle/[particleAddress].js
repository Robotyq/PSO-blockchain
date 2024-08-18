import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import styles from '../../page.module.css';
import {useWeb3} from '@/components/Web3Provider';
import {fetchParticlesData, getTargetFunction, iterateParticle} from "@/scripts/blockchain";
import {initializeControllerFromAddress} from "@/scripts/users_scripts";
import ParticlesList from "@/components/ParticlesList";
import ControllerInfo from "@/components/ControllerInfo";
import IterationControl from "@/components/IterationControl";

export default function ParticleDetails() {
    const router = useRouter();
    const {web3, account} = useWeb3();
    const {particleAddress} = router.query;
    const [particle, setParticle] = useState(null);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [targetFunction, setTargetFunction] = useState('');
    const [particles, setParticles] = useState([]);
    const [controller, setController] = useState(null);
    const [error, setError] = useState(null);
    const [userParticles, setUserParticles] = useState([]);

    useEffect(() => {
        // Access the passed particle data from router's query
        if (router.isReady && router.query.particle) {
            setParticle(JSON.parse(router.query.particle));
        } else if (router.isReady) {
            console.error("Particle data is not available. Fetching from the blockchain or showing an error is required.");
        }
    }, [router.isReady]);

    const initController = async () => {
        const controllerAddr = particle.controller;
        const controller = await initializeControllerFromAddress(web3, controllerAddr);
        setController(controller);
        console.log("controller: ", controller)
    }

    useEffect(() => {
        if (particle && web3) {
            initController();
        }
    }, [particle, web3]);

    const fetchCurrentBlock = async () => {
        if (controller) {
            const blockNumber = await web3.eth.getBlockNumber();
            const newBlockNumber = Number(blockNumber);
            setCurrentBlock(newBlockNumber);
        }
    };

    const fetchParticles = async () => {
        if (controller) {
            try {
                const particlesData = await fetchParticlesData(web3, controller);
                setParticles(particlesData);
                console.log("particlesData: ", particlesData)
                const userParticlesData = particlesData.filter(particle => particle.owner === account);
                setUserParticles(userParticlesData);
                setError(null);
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

    async function fetchTarghetFunction() {
        try {
            const targetFunctionAddress = await getTargetFunction(web3, controller);
            setTargetFunction(targetFunctionAddress.printName);
        } catch (error) {
            setError({message: error.message, stack: error.stack});
        }
    }

    const handleIterate = async (value) => {
        if (controller) {
            try {
                iterateParticle(web3, account, particle.address, value, () => {
                    fetchCurrentBlock();
                });
            } catch (error) {
                setError({message: error.message, stack: error.stack});
            }
        }
    };

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

    if (!particles.length > 0) {
        return <h1>Loading...</h1>; // Show a loading state while fetching data
    }

    return (
        <div className={styles.main}>
            <h1>Particle Details for {particleAddress} <span style={{color: 'red'}}>(the red one)</span></h1>
            <br/>
            <p><strong>Current Position:</strong> [{particle.position.join(', ')}]</p>
            <p><strong>Local Min Position:</strong> [{particle.localBest.join(', ')}]</p>
            <p><strong>Target Function address:</strong> {particle.targetFunction}</p>
            <ControllerInfo controllerAddress={controller?.options.address} currentBlock={currentBlock}
                            targetFunctionName={targetFunction}/>
            <div className={styles.center}>
                <button className={styles.button} onClick={fetchParticles}>Fetch Particles</button>
                <IterationControl onIterate={handleIterate}/>

                {error && (
                    <div className={styles.error}>
                        <p>{error.message}</p>
                        <pre>{error.stack}</pre>
                    </div>
                )}
            </div>
            <div className={styles.chartContainer}>
                <ParticlesList particles1={particles} account={account} selectedParticle={particle}/>
            </div>
        </div>
    );
}

