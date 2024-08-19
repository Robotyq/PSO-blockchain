import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import IterationsComboChart from "@/components/MyIterationsChart";

import styles from '../../page.module.css';
import {initializeControllerFromAddress} from "@/scripts/users_scripts";
import {useWeb3} from '@/components/Web3Provider';
import {fetchParticlesData} from "@/scripts/blockchain";
import MyParticlesComboChart from "@/components/MyParticleComboChart";
import ComboChart from "@/components/ComboChart";


export default function ParticleStatistics() {
    const router = useRouter();
    const {web3, account} = useWeb3();
    const {particle, controller} = router.query;
    const [parsedParticle, setParsedParticle] = useState(null);
    const [controllerInstance, setControllerInstance] = useState(null);
    const [particles, setParticles] = useState([]);

    async function initController() {
        const controllerInstance = await initializeControllerFromAddress(web3, controller);
        setControllerInstance(controllerInstance);
        console.log("controller: ", controller)
    }

    useEffect(() => {
        if (particle && web3) {
            setParsedParticle(JSON.parse(particle));
            initController();
        }
    }, [particle, web3]);

    useEffect(() => {
        if (controllerInstance) {
            fetchParticles();
        }
    }, [controllerInstance]);

    const fetchParticles = async () => {
        try {
            const particlesData = await fetchParticlesData(web3, controllerInstance);
            setParticles(particlesData);
            console.log("particlesData: ", particlesData)
        } catch (error) {
            console.log({message: error.message, stack: error.stack});
        }
    };


    if (!parsedParticle || !controller) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className={styles.main}>
            <h1>Particle Statistics</h1>
            <h3> for {parsedParticle.name}</h3>
            <h4> owner {parsedParticle.owner}</h4>
            <br/>
            <h3> Iterations per block</h3>
            <div className={styles.chartContainer}>
                <IterationsComboChart controller={controllerInstance} particles={particles} web3={web3}
                                      selectedParticle={parsedParticle.name}/>
            </div>
            <br/>
            <br/>
            <br/>
            <h3> Iterations and gas cost </h3>
            <div className={styles.chartContainer}>
                <MyParticlesComboChart controller={controllerInstance} particles={particles} web3={web3}
                                       account={account} selectedParticle={parsedParticle}/>
            </div>
            <br/>
            <br/>
            <br/>
            <h3> Evolution of particle's value and the Global Min</h3>
            <div className={styles.chartContainer}>
                <ComboChart controller={controllerInstance} particles={particles} web3={web3}
                            selectedParticle={parsedParticle.name}/>
            </div>
        </div>
    );
}
