import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ count: null }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/waitlist_signups?select=*`,
      {
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "count=exact",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ count: null }, { status: 200 });
    }

    const contentRange = response.headers.get("content-range") || "";
    const match = contentRange.match(/\/(\d+)$/);
    const count = match ? Number(match[1]) : null;

    if (count === null || Number.isNaN(count)) {
      return NextResponse.json({ count: null }, { status: 200 });
    }

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}

