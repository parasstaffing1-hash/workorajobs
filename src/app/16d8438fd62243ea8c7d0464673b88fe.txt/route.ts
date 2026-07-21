import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("16d8438fd62243ea8c7d0464673b88fe", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
