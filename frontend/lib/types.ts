export const STATUSES = [
  "Pending",
  "Accepted",
  "Completed",
  "Cancelled",
] as const;
export const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "IT Support",
  "Other",
] as const;

export type Status = (typeof STATUSES)[number];
export type Category = (typeof CATEGORIES)[number];

export type RequestOwner = { _id: string; name: string; email: string };

export type ServiceRequest = {
  _id: string;
  title: string;
  description: string;
  category: Category;
  budget: number;
  status: Status;
  user: RequestOwner;
  createdAt: string;
  updatedAt: string;
};

export type Stats = Record<Status, number> & { total: number };

export type ListResponse = {
  data: ServiceRequest[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};
