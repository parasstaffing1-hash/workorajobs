import { NextResponse } from "next/server";
import { isOpenSearchAvailable, getOpenSearchClient } from "@/lib/opensearch/client";
import { getOpenSearchConfig } from "@/lib/opensearch/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isAvailable = await isOpenSearchAvailable();
    const config = getOpenSearchConfig();
    const client = getOpenSearchClient();

    let stats: any = null;
    if (isAvailable && client) {
      const clusterHealth = await client.cluster.health({ timeout: "3s" }).catch(() => null);
      stats = clusterHealth?.body || null;
    }

    return NextResponse.json({
      status: isAvailable ? "UP" : "DOWN",
      engine: "OpenSearch",
      node: config.node,
      enabled: config.enabled,
      cluster: stats,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "DOWN", error: err.message },
      { status: 503 }
    );
  }
}
