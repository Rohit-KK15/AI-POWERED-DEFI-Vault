# DeFi Portfolio Vault Frontend

A modern Next.js frontend for the DeFi Portfolio Vault with AI agent integration.

## Features

- **Wallet Connection**: Connect with MetaMask, WalletConnect, or injected wallets
- **Vault Dashboard**: View total assets, managed assets, user balance, and shares
- **Deposit/Withdraw**: Deposit LINK tokens or withdraw shares
- **Strategy Management**: View strategy allocations and rebalance
- **Harvest**: Collect yields from strategies
- **AI Agent Chat**: Interact with the Strategy Sentinel Agent

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_STRATEGY_AAVE_ADDRESS=0x...
NEXT_PUBLIC_STRATEGY_LEVERAGE_ADDRESS=0x...
NEXT_PUBLIC_LINK_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

3. Run development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Integration with Agent

To connect the frontend to your agent backend:

1. Update `src/app/api/agent/route.ts` to call your agent service
2. Or set up a proxy to your agent API endpoint
3. The agent should be running on the `packages/agents/defi-portfolio` service

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Wagmi (Web3)
- Viem (Ethereum library)

