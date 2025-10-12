// src/api/aiPlannerApi.js
import axios from "axios";
import Cookies from "js-cookie";

// ★ 서버 베이스 URL
const API_BASE_URL = "http://13.55.41.77:8080";

// 공통 axios 인스턴스
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 매 요청 전 토큰 붙이기
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || // ✅ 추가
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // 디버깅: save/put 호출 시 전체 URL/바디 확인
  const url = `${config.baseURL || ""}${config.url || ""}`;
  if (config.method === "post" || config.method === "put") {
    if (String(url).includes("/organizer/ai/")) {
      console.log("[API]", config.method?.toUpperCase(), url, config.data);
    }
  }
  return config;
});

// --- 유틸: 시즌 객체 → CSV 문자열 (백엔드가 문자열을 더 안전하게 받음) ---
function seasonsToCsv(seasons = {}) {
  const map = {
    spring: "SPRING",
    summer: "SUMMER",
    autumn: "AUTUMN",
    winter: "WINTER",
    allYear: "ALL_YEAR",
  };
  return Object.entries(seasons)
    .filter(([, v]) => !!v)
    .map(([k]) => map[k])
    .filter(Boolean)
    .join(",");
}

/**
 * 1) 플래너 세션 시작
 * POST /api/v1/organizer/ai/planner
 * -> { sessionId, message }
 */
export async function startPlanner() {
  const { data } = await api.post("/api/v1/organizer/ai/planner", {});
  // data: { sessionId: string, message: string }
  return data;
}

/**
 * 2) 입력 보내기
 * POST /api/v1/organizer/ai/planner/input
 * body: { sessionId, region, seasons, target, brief }
 *  - ⚠️ localSpecialities 같은 필드는 백엔드가 인지 못 하므로 보내지 마세요.
 */
export async function sendInput({
  sessionId,
  region,
  seasons, // {spring:true, ...}
  target,
  brief, // 간단 설명
}) {
  const payload = {
    sessionId: String(sessionId || "").trim(),
    region: String(region || "").trim(),
    seasons: seasonsToCsv(seasons || {}), // "SPRING,SUMMER" 형태
    target: String(target || "").trim(),
    brief: String(brief || "").trim(),
  };
  const { data } = await api.post(
    "/api/v1/organizer/ai/planner/input",
    payload
  );
  return data; // 통상 200 OK, 바디는 사용안해도 됨
}

/**
 * 3) 제안서 생성
 * POST /api/v1/organizer/ai/planner/proposals
 * body: { sessionId, region, target }
 * -> { sessionId, title, overview, intentAndConcept, program, sideEvents, expectedEffects, region, season, target }
 */
export async function makeProposal({ sessionId, region, target }) {
  const payload = {
    sessionId: String(sessionId || "").trim(),
    region: String(region || "").trim(),
    target: String(target || "").trim(),
  };
  const { data } = await api.post(
    "/api/v1/organizer/ai/planner/proposals",
    payload
  );
  return data;
}

/**
 * 4) 제안서 저장 (DB에 레코드 생성)
 * POST /api/v1/organizer/ai/planner/proposals/save
 * body: { sessionId, organizerId, affiliation }
 * -> number (생성된 proposalId, Long)
 *
 * ⚠️ organizerId는 '숫자'여야 합니다. (Long)
 */
export async function saveProposal({ sessionId, organizerId, affiliation }) {
  const payload = {
    sessionId: String(sessionId || "").trim(),
    organizerId: Number(organizerId), // ← Long 변환 오류 방지
    affiliation: String(affiliation || "").trim(),
  };
  const { data } = await api.post(
    "/api/v1/organizer/ai/planner/proposals/save",
    payload
  );
  return data; // ex) 123 (proposalId)
}

/**
 * 5) 최종 내용 수정/확정
 * PUT /api/v1/organizer/ai/proposals/{proposalId}
 * body: { title, region, season, target, summary, source: "AI" }
 *
 * ⚠️ proposalId는 저장에서 받은 '숫자(Long)'를 그대로 사용해야 합니다.
 */
export async function updateProposal(
  proposalId,
  { title, region, season, target, summary }
) {
  const pid = Number(proposalId); // ← String→Long 변환 실패 방지
  const payload = {
    title: String(title || "").trim(),
    region: String(region || "").trim(),
    season: String(season || "").trim(),
    target: String(target || "").trim(),
    summary: String(summary || "").trim(),
    source: "AI",
  };
  const { data } = await api.put(
    `/api/v1/organizer/ai/proposals/${pid}`,
    payload
  );
  return data; // 보통 200 OK
}

/** (옵션) 디버그
 * GET /api/v1/organizer/ai/planner/debug?sessionId=...
 */
export async function debug(sessionId) {
  const { data } = await api.get("/api/v1/organizer/ai/planner/debug", {
    params: { sessionId },
  });
  return data;
}
// src/api/aiPlannerApi.js (파일 하단에 추가)
export async function createPlanApi({
  region,
  seasons,
  tags,
  localSpecialty,
  noSpecialty,
  intent,
  noPlan,
}) {
  // 1) 세션 생성
  const { sessionId } = await startPlanner();
  if (!sessionId) throw new Error("세션 생성 실패");

  // 태그에서 target 뽑기
  const firstTag =
    String(tags || "")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)[0] || "일반";

  // 2) 입력 전송 (백엔드 스펙: brief / localSpecialties 안보냄)
  await sendInput({
    sessionId,
    region: region || "",
    seasons: seasons || {},
    target: firstTag,
    brief: noPlan ? "" : intent || "",
  });

  // 3) 제안 생성
  const draft = await makeProposal({ sessionId, region, target: firstTag });

  // 4) 저장해서 proposalId(Long) 확보
  // ✅ organizerId: organizerId → id 우선순위로 받고, 숫자/양수 검증
  let proposalId = null;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    let organizerId = Number(user?.organizerId ?? user?.id ?? NaN);
    let affiliation = String(user?.affiliation || "").trim();

    // ✅ 개발모드 폴백: organizerId 없으면 1로 강제
    if (!Number.isFinite(organizerId) || organizerId <= 0) {
      if (process.env.NODE_ENV !== "production") {
        organizerId = Number(process.env.REACT_APP_DEV_ORGANIZER_ID || 1);
        if (!affiliation) affiliation = "LOCAL_DEV";
        console.warn("[aiPlanner] organizerId 없음 → DEV 폴백 사용:", {
          organizerId,
          affiliation,
        });
      } else {
        console.warn("[aiPlanner] organizerId 누락/비정상", {
          user,
          organizerId,
        });
        throw new Error("organizerId_missing");
      }
    }
    if (!sessionId || !String(sessionId).trim()) {
      console.warn("[aiPlanner] sessionId 누락/비정상", { sessionId });
      throw new Error("sessionId_missing");
    }

    const payload = { sessionId, organizerId, affiliation };
    console.log("[aiPlanner] /proposals/save payload →", payload);

    const saved = await saveProposal(payload);
    const n = Number(saved); // 문자열 "123"이어도 숫자로 저장
    if (Number.isFinite(n)) proposalId = n;
  } catch (e) {
    // 저장 실패해도 초안은 보여줄 수 있으니 무시 (수정 완료는 제한)
    if (e?.response) {
      console.error("saveProposal error:", {
        status: e.response.status,
        data: e.response.data,
      });
    } else {
      console.warn("saveProposal failed:", e?.message || e);
    }
  }

  return { ...draft, sessionId, proposalId };
}
