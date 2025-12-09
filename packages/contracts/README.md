# MetaVault AI — Smart Contracts

This package contains the Solidity contracts powering MetaVault AI. It uses Hardhat for development, testing, and local deployment. Contracts are primarily mock implementations for safe local testing of AI agent strategies.

---

## Contracts Overview

- **Vault.sol**  
  ERC20-based vault that accepts LINK, issues shares, computes NAV, charges performance & withdrawal fees, and interacts with the strategy router.

- **StrategyRouter.sol**  
  Orchestrates active strategies, maintains target BPS weights, supports rebalancing and aggregate portfolio queries (e.g., `getPortfolioState()`).

- **Aave V3 Strategy (Mock)**  
  Simulates safe supply behavior and interest accrual via a mocked liquidity index.

- **Leverage Strategy (Mock)**  
  Simulates borrowing, swapping, resupplying (looping), and liquidation scenarios for AI-driven risk tests.

- **Mocks**  
  Mock Aave pool, mock aToken, mock swap router, and mock token contracts (LINK, WETH) used for deterministic testing.

---

## Quickstart

> Commands assume you are in the monorepo root.

1. Install dependencies:
```bash
pnpm install
```
2. Compile contracts:
```bash
pnpm run contracts:compile
```

3. Run local Hardhat node:
```bash
pnpm hardhat node
```

4. Deploy Contracts to local node:
```bash
pnpm run contracts:deploy:local
```

5. Run tests:
```bash
pnpm run contracts:test
```
