import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas";
import { setAuthCookie } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  let res: Response;
  try {
    res = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Cannot reach the server" },
      { status: 503 },
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Registration failed", errors: data.errors },
      { status: res.status },
    );
  }

  const response = NextResponse.json({ user: data.user }, { status: 201 });
  setAuthCookie(response, data.token);
  return response;
}
