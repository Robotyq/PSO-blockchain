import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

export default function ParticleDetails() {
    const router = useRouter();
    const {particleAddress} = router.query; // Get the particle address from the URL

    const [particle, setParticle] = useState(null);

    useEffect(() => {
        if (particleAddress) {
            // Fetch the particle details from the blockchain
            // fetchParticleDetails(particleAddress).then(setParticle);
        }
    }, [particleAddress]);

    if (!particle) {
        return <h1>Loading...</h1>; // Show a loading state while fetching data
    }

    return (
        <div>
            <h1>Particle Details for {particleAddress}</h1>
            <p><strong>Controller:</strong> {particle.controller}</p>
            <p><strong>Current Position:</strong> [{particle.position.join(', ')}]</p>
            <p><strong>Global Min Position:</strong> [{particle.localBest.join(', ')}]</p>
            <p><strong>Target Function:</strong> {particle.targetFunction}</p>
            {/* You can add more details and styling as needed */}
        </div>
    );
}
