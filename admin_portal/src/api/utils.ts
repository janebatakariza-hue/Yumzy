import type { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string; errors?: { msg: string }[] }>;
  const data = axiosError.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.msg).join(", ");
  if (data?.message) return data.message;
  if (axiosError.message === "Network Error") return "Unable to reach the server. Please check your connection.";
  return axiosError.message || "Something went wrong. Please try again.";
}

export function normalizeDoc<T extends Record<string, unknown>>(doc: T): T & { id: string } {
  const id = (doc._id as string) || (doc.id as string) || "";
  return { ...doc, id };
}

export function normalizeList<T extends Record<string, unknown>>(items: T[]): (T & { id: string })[] {
  return items.map(normalizeDoc);
}
