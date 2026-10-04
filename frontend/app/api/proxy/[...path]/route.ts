import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  if (path[0] !== "requests") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token)
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );

  const hasBody = !["GET", "HEAD", "DELETE"].includes(req.method);
  let res: Response;
  try {
    res = await fetch(
      `${process.env.API_URL}/${path.join("/")}${req.nextUrl.search}`,
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: hasBody ? await req.text() : undefined,
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      { message: "Cannot reach the API server" },
      { status: 503 },
    );
  }

  if (res.status === 204) return new NextResponse(null, { status: 204 });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
