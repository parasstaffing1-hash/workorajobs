import { NextResponse } from "next/server";

import { n8nStore } from "@/lib/N8nConnector";

export async function POST() {
  try {
    n8nStore.logs = [];
    return NextResponse.json({
      success: true,
      message: "Server log history cleared successfully.",
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
