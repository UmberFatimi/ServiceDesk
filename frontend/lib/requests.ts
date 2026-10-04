import "server-only";
import { notFound } from "next/navigation";
import { ApiError, apiFetch } from "./api";
import type { CurrentUser, ServiceRequest } from "./types";

export async function getCurrentUser() {
  const { user } = await apiFetch<{ user: CurrentUser }>("/auth/me");
  return user;
}

export async function getRequest(id: string) {
  try {
    return await apiFetch<ServiceRequest>(`/requests/${id}`);
  } catch (e) {
    if (e instanceof ApiError && [400, 403, 404].includes(e.status)) notFound();
    throw e;
  }
}

export const formatBudget = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
