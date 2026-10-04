import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "./auth";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;

  let res: Response;
  try {
    res = await fetch(`${process.env.API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(503, "Cannot reach the API server");
  }

  if (res.status === 401) redirect("/login?expired=1");
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message ?? "Request failed");
  return data as T;
}
