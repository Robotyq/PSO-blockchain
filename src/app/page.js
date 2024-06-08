"use client";

import {Web3Provider} from './components/Web3Provider';
import './globals.css';  // Import global styles

function MyApp({Component, pageProps}) {
    return (
        <Web3Provider>
            <Component {...pageProps} />
        </Web3Provider>
    );
}

export default MyApp;
