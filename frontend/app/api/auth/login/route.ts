import { loginSchema } from "@/lib/schemas";
import { setAuthCookie } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch (err) {
    console.error(
      "Login fetch failed:",
      err,
      "| API_URL =",
      process.env.API_URL,
    );
    return NextResponse.json(
      { message: "Cannot reach the server" },
      { status: 503 },
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Login failed" },
      { status: res.status },
    );
  }

  const response = NextResponse.json({ user: data.user });
  setAuthCookie(response, data.token);
  return response;
}
