// src/api/mypage.js
import api from "./api";

/* ---------------------- 🧭 Organizer (주최자)용 ---------------------- */

/** ✅ 제안/등록 콘텐츠 목록 조회 */
export const fetchProposals = async () => {
  const res = await api.get("/api/v1/organizer/mypage/proposals");
  return res.data;
};

/** ✅ 홍보 콘텐츠 목록 조회 */
export const fetchPromotions = async () => {
  const res = await api.get("/api/v1/organizer/mypage/promotions");
  return res.data;
};

/** ✅ 리뷰 목록 조회 */
export const fetchReviewHeads = async () => {
  const res = await api.get("/api/v1/organizer/mypage/reviews");
  return res.data;
};

/** ✅ 프로필 조회 (organizerId 필요) */
export const fetchProfile = async (organizerId) => {
  try {
    const res = await api.get("/api/v1/organizer/mypage", {
      params: { organizerId },
    });
    return res.data; // { displayName, affiliation }
  } catch (err) {
    console.error("❌ fetchProfile 오류:", err);
    throw err;
  }
};

/** ✅ 프로필 수정 (비밀번호, 연락처, 소속 변경) */
export const updateProfile = async (organizerId, data) => {
  try {
    const res = await api.put(
      `/api/v1/organizer/mypage/users/${organizerId}`,
      data
    );
    return res.data;
  } catch (err) {
    console.error("❌ updateProfile 오류:", err);
    throw err;
  }
};

/** ✅ 제안 수정 */
export const updateProposal = async (proposalId, data) => {
  try {
    const res = await api.put(
      `/api/v1/organizer/mypage/proposals/${proposalId}`,
      data
    );
    return res.data;
  } catch (err) {
    console.error("❌ updateProposal 오류:", err);
    throw err;
  }
};

/* ---------------------- 👤 일반 사용자용 ---------------------- */

/** ✅ 찜한 콘텐츠 목록 조회 */
export const fetchFavorites = async () => {
  try {
    const res = await api.get("/api/v1/user/mypage/content");
    return res.data;
  } catch (err) {
    console.error("❌ fetchFavorites 오류:", err);
    throw err;
  }
};

/** ✅ 내 일정 목록 조회 */
export const fetchPlans = async () => {
  try {
    const res = await api.get("/api/v1/user/mypage/plan");
    return res.data;
  } catch (err) {
    console.error("❌ fetchPlans 오류:", err);
    throw err;
  }
};
