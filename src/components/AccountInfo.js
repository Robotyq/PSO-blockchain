import React from 'react';
import styles from '../page.module.css';

const AccountInfo = ({account, web3, role = 'user'}) => {
    if (!web3) {
        return (
            <div className={styles.info}>
                <h3>Web3 Not Connected! Please connect a metamask account</h3>
            </div>
        );
    }

    return (
        <div className={styles.info}>
            <h2>Account: {account} ({role})</h2>
        </div>
    );
};

export default AccountInfo;
