"use client";
import { useState, useEffect } from 'react';
import { useWeb3 } from '../components/Web3Provider';
import ControllerContract from '../contracts/Controller.json';
import ParticleContract from '../contracts/Particle.json';

export default function Home() {
  const { web3, account } = useWeb3();
  const [controller, setController] = useState(null);
  const [particles, setParticles] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (web3) {
      const initContracts = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ControllerContract.networks[networkId];
        if (deployedNetwork) {
          const controllerInstance = new web3.eth.Contract(
              ControllerContract.abi,
              deployedNetwork && deployedNetwork.address
          );
          setController(controllerInstance);
        } else {
          console.error('Controller contract not deployed on this network');
        }
      };
      initContracts();
    }
  }, [web3]);

  const fetchParticles = async () => {
    if (controller) {
      const particleCount = await controller.methods.getParticlesCount().call();
      const particlePromises = [];
      for (let i = 0; i < particleCount; i++) {
        particlePromises.push(controller.methods.particles(i).call());
      }
      const particleAddresses = await Promise.all(particlePromises);
      const particleData = await Promise.all(
          particleAddresses.map(async (address) => {
            const particleInstance = new web3.eth.Contract(ParticleContract.abi, address);
            const position = await Promise.all([
              particleInstance.methods.position(0).call(),
              particleInstance.methods.position(1).call(),
            ]);
            return { address, position };
          })
      );
      setParticles(particleData);
    }
  };

  const fetchEvents = async () => {
    if (controller) {
      const currentBlockNumber = await web3.eth.getBlockNumber();
      const fromBlock = Math.max(currentBlockNumber - 10, 0);
      const events = await controller.getPastEvents('allEvents', {
        fromBlock,
        toBlock: 'latest',
      });
      setEvents(events);
    }
  };

  return (
      <div>
        <h1>Blockchain Particle System</h1>
        <p>Account: {account}</p>
        <button onClick={fetchParticles}>Fetch Particles</button>
        <button onClick={fetchEvents}>Fetch Events</button>

        <h2>Particles</h2>
        <ul>
          {particles.map((particle, index) => (
              <li key={index}>
                Address: {particle.address}, Position: [{particle.position.join(', ')}]
              </li>
          ))}
        </ul>

        <h2>Events</h2>
        <ul>
          {events.map((event, index) => (
              <li key={index}>
                {event.event}: {JSON.stringify(event.returnValues)}
              </li>
          ))}
        </ul>
      </div>
  );
}
