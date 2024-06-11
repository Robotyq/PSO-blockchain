import React from 'react';
import styles from '../page.module.css';

const AccountInfo = ({ account, web3 }) => (
    <div className={styles.info}>
        <h3>Web3: {web3 ? 'Connected' : 'Not Connected'}</h3>
        <h2>Account: {account}</h2>
    </div>
);

export default AccountInfo;
