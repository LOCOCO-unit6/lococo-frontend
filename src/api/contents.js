import { api } from "./client";

const PATHS = {
  list: "/contents",
  create: "/contents",
  detail: (id) => `/contents/${id}`,
};

export async function listContents(params = { page: 0, size: 20 }) {
  const { data } = await api.get(PATHS.list, { params });
  return data?.content || data || [];
}

export async function createContent({ fields, files }) {
  const form = new FormData();
  Object.entries(fields || {}).forEach(([k, v]) => form.append(k, v));
  (files || []).forEach((file) => form.append("files", file));
  const { data } = await api.post(PATHS.create, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getContent(id) {
  const { data } = await api.get(PATHS.detail(id));
  return data;
}
