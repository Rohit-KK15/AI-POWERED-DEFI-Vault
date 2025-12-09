# MetaVault AI — Agents

This package contains the **autonomous AI agents** that monitor and manage the MetaVault.  
Built with **ADK-TS (Agent Development Kit)** by IQAI, these agents orchestrate on-chain actions, respond to users, and automate vault strategy logic.

---

## Features

- **Strategy Sentinel Agent**  
  Monitors token prices, LTV, liquidation risk; rebalances, pauses/unpauses strategies, and manages leverage.

- **Chat Agent**  
  Natural language interface for users: balance checks, deposits, withdrawals, APY lookups, and vault insights.

- **Yield Generator Agent**  
  Simulates accrual scenarios for testing and UX demonstrations.

- **Telegram Agent**  
  Sends monitoring summaries, alerts, and automation logs to Telegram channels (optional in production).

- **Automation / Cron Service**  
  Periodic tasks that run checks (price, risk, rebalances, harvests) using node-cron.

---

## Quickstart

> These commands are intended to be run from the monorepo root.

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp packages/agents/defi-portfolio/.env.example packages/agents/defi-portfolio/.env
# edit .env as required
```

3. Start development server:
```bash
pnpm run dev:agents
```

4. Build production server:
```bash
pnpm run build:agents
```

5. Start production server:
```bash
pnpm run start:agents
```
