// Web3NotConnectedMessage.js

import React from 'react';
import styles from '../page.module.css';

const Web3NotConnectedMessage = () => (
    <div className={styles.info}>
        <h1>Wallet Not Connected!</h1>
        <h1>Please connect a MetaMask account</h1>
        <br/>
        <h4>
            If you missed the MetaMask popup, you can click on the fox icon in the top right corner of your
            browser.
        </h4>
        <br/>
        <br/>
        <br/>
        <br/>
        <h3>You do not have to create an account on this website.</h3>
        <h3>You should just select what Ethereum account you want to use.</h3>
        <br/>
        <h3>If you do not have an Ethereum account, you can create one using MetaMask.</h3>
        <h3>MetaMask is a browser extension that allows you to interact with the Ethereum blockchain.</h3>
        <h3>
            You can download it from <a href="https://metamask.io/download.html" style={{color: 'blue'}}>here</a>.
        </h3>
        <br/>
        <h3>
            If you already have MetaMask installed, you can connect your account by clicking on the MetaMask icon in
            the top right corner of your browser.
        </h3>
    </div>
);

export default Web3NotConnectedMessage;
