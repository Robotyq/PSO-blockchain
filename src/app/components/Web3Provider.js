"use client";
import React, { useEffect, useState, createContext, useContext } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const initWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3Instance.eth.getAccounts();
                setWeb3(web3Instance);
                setAccount(accounts[0]);
            } catch (error) {
                console.error("User denied account access...");
            }
        } else if (window.web3) {
            const web3Instance = new Web3(window.web3.currentProvider);
            setWeb3(web3Instance);
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    };

    useEffect(() => {
        initWeb3();
    }, []);

    return (
        <Web3Context.Provider value={{ web3, account }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);
