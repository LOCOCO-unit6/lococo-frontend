import { api } from "./client";

// 🔸 백엔드 스웨거에서 경로만 다르면 아래 PATHS를 바꿔주세요.
const PATHS = {
  login: "/users/login", // UserController.login(LoginRequestDto)
  me: "/users/me",
};

export async function login({ identification, password }) {
  // 서버 DTO: { identification, password }
  const { data } = await api.post(PATHS.login, { identification, password });
  // 기대 응답 예시: { accessToken, refreshToken?, userId?, role? }
  if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
  if (data?.refreshToken)
    localStorage.setItem("refreshToken", data.refreshToken);
  if (data?.role) localStorage.setItem("userRole", data.role);
  if (data?.userId) localStorage.setItem("userId", data.userId);
  return data;
}

export async function me() {
  const { data } = await api.get(PATHS.me);
  if (data?.role) localStorage.setItem("userRole", data.role);
  return data;
}

export function logout() {
  ["accessToken", "refreshToken", "userRole", "userId"].forEach((k) =>
    localStorage.removeItem(k)
  );
}
export function getOrganizerId() {
  try {
    const raw = localStorage.getItem("auth");
    const json = raw ? JSON.parse(raw) : null;
    return json?.organizerId ?? null; // number|string
  } catch {
    return null;
  }
}
localStorage.setItem("auth", JSON.stringify({ organizerId: 1 /* 예시 */ }));
