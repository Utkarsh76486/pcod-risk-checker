import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answers } = await req.json();
  try {
    const res = await fetch(`${process.env.ML_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) throw new Error("ml error");
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "ml_unavailable" }, { status: 503 });
  }
}