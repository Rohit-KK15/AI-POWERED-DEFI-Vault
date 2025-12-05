import { ToolContext } from "@iqai/adk";

// Shared state store for APY data (persists across API calls)
// In production, this could be replaced with a database or Redis
const apyStateStore: Record<string, { lastTVL?: number; lastTimestamp?: number }> = {};

/**
 * Helper function to get vault APY data.
 * This creates a context with persistent state and calls the APY calculation function.
 */
export async function getVaultAPY(): Promise<{
  apy: number;
  readable: string;
  tvl?: number;
  growth?: number;
  dt?: number;
  message?: string;
}> {
  // Use a shared state key that matches what the tool expects
  const stateKey = "session.vault_apy_state";
  
  // Create a minimal tool context with persistent state
  // We only need the state property for this tool, so we use type assertion
  const toolContext = {
    state: {
      [stateKey]: apyStateStore[stateKey] || {}
    },
    sessionId: "vault_apy_shared",
    userId: "system",
  } as unknown as ToolContext;

  // Import the calculation function directly
  const { calculateVaultAPY } = await import("./tools");
  
  // Call the calculation function with the context
  const result = await calculateVaultAPY(toolContext);
  
  // Persist the updated state back to our store
  if (toolContext.state[stateKey]) {
    apyStateStore[stateKey] = toolContext.state[stateKey] as {
      lastTVL?: number;
      lastTimestamp?: number;
    };
  }
  
  return result;
}

