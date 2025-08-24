// src/utils/Api.js
import axios from "axios";

export const API_BASE_URL = "http://3.39.0.20:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const normErr = (e) =>
  e?.response?.data || { message: e?.message || "요청 실패" };

/** ===== 회원가입 ===== */
// 공통 등록 엔드포인트: /api/v1/register (role만 다름)
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

/** ===== 이메일 인증 ===== */
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

export const generatePromoApi = (planId, body) =>
  api.post(`/promotions/generate`, { planId, ...body });
export const savePromoPickApi = (promotionId, body) =>
  api.post(`/promotions/${promotionId}/save`, body);

export const createContentApi = (formData) =>
  api.post("/contents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
