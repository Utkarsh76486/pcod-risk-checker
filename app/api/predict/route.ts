import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const base = process.env.ML_API_URL;
    if (!base) {
      return NextResponse.json({ error: "ML_API_URL not set" }, { status: 500 });
    }

    const res = await fetch(`${base.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: body?.answers ?? [],
        age: typeof body?.age === "number" ? body.age : null,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "ML service error" }, { status: 502 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}