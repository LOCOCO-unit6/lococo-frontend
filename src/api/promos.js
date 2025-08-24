import { api } from "./client";

const PATHS = {
  generate: "/ai/promos/generate", // POST: {intro, headline, detail} -> [{id,title,body}]
  list: "/promos",
  save: "/promos",
  update: (id) => `/promos/${id}`,
};

export async function generatePromos(form) {
  const { data } = await api.post(PATHS.generate, form);
  // 기대: 배열. 없으면 빈배열
  return Array.isArray(data) ? data : data?.items || [];
}

export async function listPromos(params = { page: 0, size: 50 }) {
  const { data } = await api.get(PATHS.list, { params });
  return data?.content || data || [];
}

export async function savePromo(promo) {
  const { data } = await api.post(PATHS.save, promo);
  return data;
}

export async function updatePromo(id, payload) {
  const { data } = await api.put(PATHS.update(id), payload);
  return data;
}
