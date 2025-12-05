import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, localhost } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
    chains: [localhost, sepolia, mainnet],
    connectors: [
        metaMask({
            dappMetadata: {
                name: "DeFi Portfolio Vault",
                url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
            },
        }),
        injected(),
        ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
            ? [
                walletConnect({
                    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
                }),
            ]
            : []),
    ],
    transports: {
        [localhost.id]: http(),
        [sepolia.id]: http(),
        [mainnet.id]: http(),
    },
});
