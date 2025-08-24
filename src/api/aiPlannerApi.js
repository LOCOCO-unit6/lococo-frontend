// src/api/aiPlannerApi.js
const BASE = "/api/v1/organizer/ai";

async function req(path, opt = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(opt.headers || {}) },
    ...opt,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || text || "요청 실패";
    const err = new Error(msg);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function startPlanner() {
  // POST /planner → { sessionId, message }
  return req("/planner", { method: "POST" });
}

export async function sendInput({
  sessionId,
  region,
  seasons,
  target,
  localSpecialities,
  brief,
}) {
  // Swagger: POST /planner/input (필드명 유의: localSpecialities, brief)
  return req("/planner/input", {
    method: "POST",
    body: JSON.stringify({
      sessionId,
      region,
      seasons,
      target,
      localSpecialities,
      brief,
    }),
  });
}

export async function makeProposal() {
  // POST /planner/proposals → 제안서 본문
  return req("/planner/proposals", { method: "POST" });
}

export async function saveProposal({ sessionId, organizerId, affiliation }) {
  // POST /planner/proposals/save → number
  return req("/planner/proposals/save", {
    method: "POST",
    body: JSON.stringify({ sessionId, organizerId, affiliation }),
  });
}

export async function updateProposal(proposalId, payload) {
  // PUT /ai/proposals/{proposalId}
  return req(`/proposals/${proposalId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function debug(sessionId) {
  // GET /planner/debug?sessionId=...
  const q = new URLSearchParams({ sessionId }).toString();
  return req(`/planner/debug?${q}`, { method: "GET" });
}
/** 세션 → 입력 → 제안 생성까지 한번에 수행 */
export async function createPlanApi({
  region,
  seasons,
  tags,
  localSpecialty,
  noSpecialty,
  intent,
  noPlan,
}) {
  // 1. 세션 생성
  const { sessionId } = await startPlanner();

  // 2. 입력 저장
  await sendInput({
    sessionId,
    region: region || "미정",
    seasons: Object.entries(seasons || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(","), // 콤마 문자열
    target: (tags || "").split(/[ ,]+/)[0] || "일반",
    localSpecialities: noSpecialty ? "" : localSpecialty || "",
    brief: noPlan ? "" : intent || "",
  });

  // 3. 제안 생성
  const proposal = await makeProposal();

  // 4. 결과 반환
  return { ...proposal, sessionId };
}
