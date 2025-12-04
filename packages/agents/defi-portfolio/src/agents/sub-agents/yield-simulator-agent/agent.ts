import { LlmAgent } from "@iqai/adk";
import { yield_generator } from "./tools";
import { env } from "../../../env";

export async function getYieldSimulatorAgent() {
    return new LlmAgent({
        name: "YieldSimulatorAgent",
        description: "Generating or Accruing Yield to the Pool.",
        instruction: "use the tool accrueInterest for accruing yield or interest to the pool for generating profits to the vault.",
        model: env.LLM_MODEL,
        tools: [yield_generator]
    });
}