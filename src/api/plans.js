import { api } from "./client";

const PATHS = {
  list: "/plans",
  create: "/plans",
  detail: (id) => `/plans/${id}`,
  update: (id) => `/plans/${id}`,
};

export async function listPlans(params = { page: 0, size: 50 }) {
  const { data } = await api.get(PATHS.list, { params });
  return data?.content || data || [];
}

export async function createPlan(payload) {
  const { data } = await api.post(PATHS.create, payload);
  return data;
}

export async function getPlan(id) {
  const { data } = await api.get(PATHS.detail(id));
  return data;
}

export async function updatePlan(id, payload) {
  const { data } = await api.put(PATHS.update(id), payload);
  return data;
}
