import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { POST: handler } = await import("../../chat/route");
  return handler(request);
}
