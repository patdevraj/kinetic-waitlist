// top of app/api/waitlist/route.ts (server code)
console.log("ENV CHECK - SUPABASE_URL present:", !!process.env.SUPABASE_URL);
console.log("ENV CHECK - SUPABASE_ANON_KEY present:", !!process.env.SUPABASE_ANON_KEY);

import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown; stage?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const stage = typeof body.stage === "string" ? body.stage.trim() : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { success: false, error: "Server is missing Supabase configuration." },
      { status: 500 }
    );
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email,
      stage: stage.length > 0 ? stage : null,
      source: "website",
    }),
  });

  if (!response.ok) {
    let errorMessage = "Unable to submit waitlist request.";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
        errorMessage = errorBody.message;
      } else if (typeof errorBody?.error === "string") {
        errorMessage = errorBody.error;
      }
    } catch {
      // Ignore JSON parsing errors and use fallback message.
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

