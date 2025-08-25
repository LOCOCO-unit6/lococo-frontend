// src/utils/Api.js
import axios from "axios";
import Cookies from "js-cookie";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ✅ 모든 요청에 토큰 자동 첨부 (403 방지)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const normErr = (e) =>
  e?.response?.data || { message: e?.message || "요청 실패" };

/** ===== 회원가입 ===== */
// 공통 등록 엔드포인트: /api/v1/register (role만 다름) — 기존 유지
const registerWithRole = async (payload, role) => {
  try {
    const { data } = await api.post("/api/v1/register", { ...payload, role });
    return data;
  } catch (e) {
    throw normErr(e);
  }
};
export const registerGeneral = (formData) => registerWithRole(formData, "USER");
export const registerOrganizer = (formData) =>
  registerWithRole(formData, "ADMIN");

/** ===== 이메일 인증 ===== — 기존 유지 */
export const requestEmailVerification = async (email) => {
  try {
    const { data } = await api.post("/api/v1/send-code", null, {
      params: { email },
    });
    return data;
  } catch (e) {
    throw normErr(e);
  }
};
export const confirmEmailVerification = async (email, code) => {
  try {
    const { data } = await api.post("/api/v1/verify-code", null, {
      params: { email, code },
    });
    return data;
  } catch (e) {
    throw normErr(e);
  }
};

/** ----- (기존 기타 API 유지) ----- */
export const createPlanApi = (payload) => api.post("/plans", payload);
export const listPlansApi = (params) => api.get("/plans", { params });
export const getPlanApi = (id) => api.get(`/plans/${id}`);
export const updatePlanApi = (id, body) => api.put(`/plans/${id}`, body);

/** ===== 홍보 콘텐츠 생성 (인스타그램) =====
 * Swagger:
 * POST /api/v1/organizer/ai/content/instagram
 * Request body: { proposalId: number, additionalText: string }
 * Response: { instagramId, title, content, hashtags: string[] }
 */
export const generatePromoApi = (proposalId, additionalText) => {
  return api.post(`/api/v1/organizer/ai/content/instagram`, {
    proposalId,
    additionalText,
  });
};

/** ===== 홍보 콘텐츠 선택 저장 ===== (백엔드 확인 전까지 기존 유지) */
export const savePromoPickApi = (promotionId, body) =>
  api.post(`/promotions/${promotionId}/save`, body);

export const createContentApi = (formData) =>
  api.post("/contents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
