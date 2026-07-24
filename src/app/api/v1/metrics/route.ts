import { NextResponse } from "next/server";
import { MetricsCollector } from "@/lib/observability/metrics-collector";

export async function GET() {
  const metrics = MetricsCollector.getPrometheusMetrics();

  return new NextResponse(metrics, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
