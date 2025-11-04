// src/utils/Api.js (최종 완성본)

import axios from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = "http://13.55.41.77:8080";

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

/** ===== 주최자 마이페이지 (Organizer MyPage) ===== */

// 명세: GET /api/v1/organizer/mypage (사용자 이름, 찜 목록 등을 조회)
export const fetchOrganizerMypage = async () => {
  try {
    const response = await api.get("/api/v1/organizer/mypage");
    // 응답 데이터 구조를 가정합니다.
    return {
      userName:
        response.data?.user?.name ||
        response.data?.user?.affiliation ||
        "주최자",
      likedFestivals: response.data?.likedContents || [],
      // ... 필요한 기타 필드
    };
  } catch (e) {
    throw normErr(e);
  }
};

// 명세: PUT /api/v1/organizer/mypage/users/{organizerId}
export const updateOrganizerProfile = async (organizerId, payload) => {
  try {
    const { data } = await api.put(
      `/api/v1/organizer/mypage/users/${organizerId}`,
      payload
    );
    return data;
  } catch (e) {
    throw normErr(e);
  }
};

// ... (다른 API 함수들은 기존대로 유지)
export const createPlanApi = (payload) => api.post("/plans", payload);
export const listPlansApi = (params) => api.get("/plans", { params });
export const getPlanApi = (id) => api.get(`/plans/${id}`);
export const updatePlanApi = (id, body) => api.put(`/plans/${id}`, body);
export const generatePromoApi = (proposalId, additionalText) => {
  return api.post(`/api/v1/organizer/ai/content/instagram`, {
    proposalId,
    additionalText,
  });
};
export const savePromoPickApi = (promotionId, body) =>
  api.post(`/promotions/${promotionId}/save`, body);
export const createContentApi = (formData) =>
  api.post("/contents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
// src/utils/Api.js (추가)

// 명세: GET /api/v1/user/mypage/userInfo
export const fetchUserInfo = async () => {
  try {
    const { data } = await api.get("/api/v1/user/mypage/userInfo");
    // 사용자 정보 필드 (name, identification, role 등)를 반환
    return data;
  } catch (e) {
    throw normErr(e);
  }
};

// 명세: GET /api/v1/user/mypage/content/favorites (찜 목록)
export const fetchUserFavorites = async () => {
  try {
    const { data } = await api.get("/api/v1/user/mypage/content/favorites");
    // 찜 목록 배열을 반환한다고 가정
    return data.contentList || data.favorites || [];
  } catch (e) {
    throw normErr(e);
  }
};
// src/utils/Api.js (추가)

// 명세: GET /api/v1/user/mypage/userInfo (개인 사용자 정보 조회)
// 이 함수는 이미 fetchUserInfo로 추가되어 있다고 가정합니다.

// 명세: PUT /api/v1/user/mypage/users/{userId} (개인 사용자 정보 수정)
export const updatePersonalProfile = async (userId, payload) => {
  try {
    const { data } = await api.put(
      `/api/v1/user/mypage/users/${userId}`,
      payload
    );
    // 수정 후 업데이트된 사용자 정보를 반환한다고 가정
    return data;
  } catch (e) {
    throw normErr(e);
  }
};
export const addFavoriteFestival = async (contentId) => {
  try {
    // 🚨 찜하기는 POST 요청이며, contentId를 경로에 포함합니다.
    const { data } = await api.post(
      `/api/v1/user/mypage/content/favorites/${contentId}`
    );
    return data;
  } catch (e) {
    throw normErr(e);
  }
};

// 명세: DELETE /api/v1/user/mypage/content/favorites/{contentId} (찜 취소)
export const removeFavoriteFestival = async (contentId) => {
  try {
    // 🚨 찜 취소는 DELETE 요청이며, contentId를 경로에 포함합니다.
    const { data } = await api.delete(
      `/api/v1/user/mypage/content/favorites/${contentId}`
    );
    return data;
  } catch (e) {
    throw normErr(e);
  }
};
