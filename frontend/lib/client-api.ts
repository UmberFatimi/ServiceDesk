export class ClientApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

export async function clientFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (res.status === 401) {
    window.location.href = "/login?expired=1";
    throw new ClientApiError(401, "Session expired");
  }
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ClientApiError(
      res.status,
      data.message ?? "Something went wrong",
      data.errors,
    );
  return data as T;
}
