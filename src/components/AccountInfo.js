import React from 'react';
import styles from '../page.module.css';

const AccountInfo = ({account, web3, role = 'user'}) => (
    <div className={styles.info}>
        <h3>{web3 ? '' : 'Web3 Not Connected! Please connect a metamask account'}</h3>
        <h2>Account: {account} ({role})</h2>
    </div>
);

export default AccountInfo;
