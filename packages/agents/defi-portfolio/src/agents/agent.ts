import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getStrategySentinelAgent } from "./sub-agents/strategy-sentinel-agent/agent";
import { getYieldGeneratorAgent } from "./sub-agents/yield-generator-agent/agent";

export const getRootAgent = async () => {
    const strategySentinalAgent = await getStrategySentinelAgent();
    const yieldSimulatorAgent = await getYieldGeneratorAgent();
    return AgentBuilder
        .create("RootAgent")
        .withDescription("AI Agent that monitors and manages the Funds and Strategies of the Vault.")
        .withInstruction(`
            Use the sub-agent Strategy Sentinel Agent for getting vault, strategies, and users' stats, and perform deposit, withdraw, rebalance, harvest, auto_deleverage.
            Use the sub-agent Yield Simulator Agent for accruing or generating yeild to the Pool.
            `)
        .withModel(env.LLM_MODEL)
        .withSubAgents([strategySentinalAgent, yieldSimulatorAgent])
        .build();
}