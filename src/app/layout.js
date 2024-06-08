import "./globals.css";
import { Web3Provider } from "@/app/components/Web3Provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Particle Viewer",
    description: "View particles on the blockchain",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Web3Provider>
            {children}
        </Web3Provider>
        </body>
        </html>
    );
}
