# MetaVault AI — Frontend

Next.js frontend for MetaVault AI. Provides wallet connections, vault overview, APY display, strategy breakdown, and a chat interface powered by the backend AI agent.

---

## Features

- Wallet connection via **Wagmi + Viem** (MetaMask, WalletConnect).
- Chat interface that talks to the AI agent backend.
- Vault dashboard with APY, portfolio breakdown, and strategy details.
- Deposit / Withdraw flows (mock or real depending on deployment).
- Modern UI built with **Tailwind CSS** and **Framer Motion**.

---

## Quickstart

> From monorepo root.

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp packages/frontend/.env.example packages/frontend/.env
# edit .env as required
```

3. Start development server:
```bash
pnpm run dev:frontend
```