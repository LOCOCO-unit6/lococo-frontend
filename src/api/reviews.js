import { api } from "./client";

const PATHS = {
  listByContent: (contentId) => `/contents/${contentId}/reviews`,
};

export async function listReviews(contentId, params = { page: 0, size: 50 }) {
  const { data } = await api.get(PATHS.listByContent(contentId), { params });
  return data?.content || data || [];
}
