import '../globals.css';
import {Web3Provider} from '@/components/Web3Provider';
import {Inter} from 'next/font/google';

const inter = Inter({subsets: ['latin']});

function MyApp({Component, pageProps}) {
    return (
        <Web3Provider>
            <div className={inter.className}>
                <Component {...pageProps} />
            </div>
        </Web3Provider>
    );
}

export default MyApp;
