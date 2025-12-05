import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Temporarily disable APY feature to prevent breaking the app
  // TODO: Fix import path or set up proper API server for agents
  return NextResponse.json(
    { 
      apy: 0,
      readable: "0%",
      message: "APY calculation coming soon"
    },
    { status: 200 }
  );

  /* Original implementation - disabled to prevent app crashes
  try {
    // Dynamically import the helper function from the agents package
    const { getVaultAPY } = await import(
      "../../../../../../agents/defi-portfolio/src/agents/sub-agents/strategy-sentinel-agent/apy-helper"
    );

    const apyData = await getVaultAPY();
    return NextResponse.json(apyData);
  } catch (error: any) {
    console.error("Error fetching APY:", error);
    return NextResponse.json(
      { 
        apy: 0,
        readable: "0%",
        error: "APY calculation unavailable",
        message: error?.message || "Service temporarily unavailable"
      },
      { status: 200 }
    );
  }
  */
}

