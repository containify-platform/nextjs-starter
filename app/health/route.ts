import { connection } from "next/server";

// The health check Containify polls before sending a new release traffic.
export async function GET() {
  await connection(); // answer at request time, not from the build
  return Response.json({ ok: true });
}
