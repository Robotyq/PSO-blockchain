import {useEffect, useState} from 'react';
import {useWeb3} from '@/components/Web3Provider';
import AccountInfo from '../../components/AccountInfo';
import UserParticles from '../../components/UserParticles';
// import ControllerCards from '../../components/ControllerCards';
import DeployParticleForm from '../../components/DeployParticleForm';
import {fetchAllControllerDetails, fetchUserParticlesByEvents} from "@/scripts/users_scripts"
import styles from '../../page.module.css';
import ControllerCards from "@/components/ControllerCards";

export default function Home() {
    const {web3, account} = useWeb3();
    const [userParticles, setUserParticles] = useState([]);
    const [controllers, setControllers] = useState([]);
    const [selectedController, setSelectedController] = useState(null);
    const [controllersColors, setControllersColors] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserParticles = async () => {
            try {
                const particles = await fetchUserParticlesByEvents(web3, account);
                setUserParticles(particles);

                // Create a unique set of controllers
                const uniqueControllers = [...new Set(particles.map(particle => particle.controller))];
                const totalColors = uniqueControllers.length + 5; // 5 more colors
                const colors = {};
                for (let i = 0; i < totalColors; i++) {
                    const controller = uniqueControllers[i] || `extraColor${i - uniqueControllers.length}`;
                    colors[controller] = `hsl(${i * (360 / totalColors)}, 100%, 30%)`;
                }
                setControllersColors(colors);

                // Fetch details for each controller
                const controllerDetailsPromises = fetchAllControllerDetails(web3);
                console.log("controllerDetailsPromises: ", controllerDetailsPromises)
                const controllersData = await Promise.all(await controllerDetailsPromises);
                console.log("controllersData: ", controllersData)
                setControllers(controllersData);
            } catch (error) {
                setError({message: error.message, stack: error.stack});
                console.log("Error: ", error)
            }
        };

        if (account) {
            fetchUserParticles();
        }
    }, [account]);

    return (
        <main className={styles.main}>
            <h1>My Particles Tracker</h1>
            <AccountInfo account={account} web3={web3}/>
            <UserParticles particles={userParticles} controllersColors={controllersColors}/>
            <br/>
            <br/>
            <br/>
            <DeployParticleForm
                web3={web3}
                account={account}
                controller={selectedController}  // Use selected controller
                onParticleDeployed={() => {
                    fetchUserParticlesByEvents(web3, account).then(setUserParticles);
                }}
            />
            <ControllerCards
                controllers={controllers}
                selectedController={selectedController}
                onSelectController={setSelectedController}
                controllersColors={controllersColors}
            />
            {error && (
                <div className={styles.error}>
                    <p>{error.message}</p>
                    <pre>{error.stack}</pre>
                </div>
            )}
        </main>
    );
}
