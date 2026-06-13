import { API_URL, ApiError } from "./client";
import { getToken } from "./token";
import { StorageFileInfo } from "./types";

export function archivoUrl(id: string): string {
  return `${API_URL}/upload/${id}`;
}

export async function uploadFile(file: File): Promise<StorageFileInfo> {
  const formData = new FormData();
  formData.append("myfile", file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? `Error ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return data as StorageFileInfo;
}

export async function deleteFile(id: string): Promise<void> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/upload/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? `Error ${response.status}`;
    throw new ApiError(response.status, message);
  }
}
