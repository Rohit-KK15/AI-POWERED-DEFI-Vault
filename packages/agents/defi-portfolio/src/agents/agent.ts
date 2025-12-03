import { AgentBuilder } from "@iqai/adk";
import { model } from "../env";
import { getStrategySentinelAgent } from "./sub-agents/strategy-sentinel-agent/agent";

export const defiAgent = async () => {
    const strategySentinalAgent = await getStrategySentinelAgent();
    return await AgentBuilder
        .create("DeFi_Portfolio_Agent")
        .withDescription("Portfolio Analyser and Market Advisor")
        .withInstruction("Analyses User's Potfolio and suggest actions")
        .withModel(model)
        .withSubAgents([strategySentinalAgent])
        .build();
}