// src/pages/AiPromoStart.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AiPromotion.css";

/** ---- 저장/로드 유틸 ---- */
const STORAGE_KEY = "aiPlanner.plans";

// 후보 키(다른 페이지에서 저장했을 수 있으니 넓게 탐색)
const CANDIDATE_KEYS = [STORAGE_KEY, "aiPlans", "plannerPlans"];

function loadPlans() {
  for (const k of CANDIDATE_KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (_) {}
  }
  return [];
}
function savePlans(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
function clearPlans() {
  CANDIDATE_KEYS.forEach((k) => localStorage.removeItem(k));
}

/** ---- 더미(Seed) ---- */
function makeSeedPlans() {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: "p1",
      title: "용인 가나다 축제",
      region: "경기도 용인시",
      season: "여름",
      target: "초등학생",
      date: today,
    },
    {
      id: "p2",
      title: "수원 야간 버스킹",
      region: "경기도 수원시",
      season: "가을",
      target: "가족",
      date: today,
    },
    {
      id: "p3",
      title: "분당 청년마켓",
      region: "경기도 성남시",
      season: "봄",
      target: "청년",
      date: today,
    },
  ];
}

function normalizePlan(p) {
  const title =
    p.title || p.name || p.festivalTitle || p.projectTitle || "무제";
  const region = p.region || p.location || p.city || "미정";
  const season = p.season || p.seasonality || "미정";
  const target = p.target || p.audience || "미정";
  const date =
    p.date ||
    p.eventDate ||
    (p.createdAt && String(p.createdAt).slice(0, 10)) ||
    "YYYY-MM-DD";
  const id = p.id || p._id || title + "-" + date;
  return { id, title, region, season, target, date, raw: p };
}

export default function AiPromoStart() {
  const nav = useNavigate();
  const [search] = useSearchParams();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (search.get("clear") === "1") {
      clearPlans();
    }
    if (search.get("seed") === "1") {
      savePlans(makeSeedPlans());
    }
    setPlans(loadPlans());
  }, [search]);

  const list = useMemo(() => plans.map(normalizePlan), [plans]);

  const goPlanner = () => nav("/AiPlanner");
  const goToForm = (plan) => {
    sessionStorage.setItem("aiPromo.plan", JSON.stringify(plan.raw || plan));
    nav("/organizer/ai-promo/form");
  };
  const goDetail = (plan) =>
    nav(`/AiPlanner?planId=${encodeURIComponent(plan.id)}`);
  const goEdit = (plan) =>
    nav(`/AiPlanner?planId=${encodeURIComponent(plan.id)}&edit=1`);

  /* 개발용 도크(개발 모드에서만 노출) */
  const isDev = process.env.NODE_ENV === "development";
  const seedNow = () => {
    savePlans(makeSeedPlans());
    setPlans(loadPlans());
  };
  const clearNow = () => {
    clearPlans();
    setPlans([]);
  };

  return (
    <main className="ai-promo-wrap">
      <h1 className="ai-promo-title">AI 홍보 콘텐츠 생성</h1>
      <p className="ai-promo-subtitle">생성할 홍보 콘텐츠 정보를 알려주세요</p>

      <section className="ai-promo-card ai-promo-start-card">
        <h3 className="start-title">
          홍보물 생성을 원하는 콘텐츠를 선택 해주세요
        </h3>

        {/* 기획서 없음 → 1번 이미지 상태 */}
        {list.length === 0 && (
          <div className="start-empty">
            <div className="start-empty-box">
              <div className="start-empty-text">
                콘텐츠를 먼저 생성 해주세요
              </div>
              <button className="ai-btn primary lg" onClick={goPlanner}>
                기획하러 가기
              </button>
            </div>
          </div>
        )}

        {/* 기획서 있음 → 2번 이미지 상태 */}
        {list.length > 0 && (
          <div className="plan-list">
            {list.map((p) => (
              <div
                key={p.id}
                className="plan-item"
                onClick={() => goToForm(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && goToForm(p)}
              >
                <div className="plan-main">
                  <div className="plan-title">
                    <span className="badge">{p.title}</span>
                  </div>
                  <div className="plan-date">{p.date}</div>
                </div>

                <div className="plan-sub">
                  지역: {p.region}　시즌: {p.season}　타겟: {p.target}
                </div>

                <div
                  className="plan-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="ai-btn ghost sm"
                    onClick={() => goDetail(p)}
                  >
                    상세보기
                  </button>
                  <button className="ai-btn ghost sm" onClick={() => goEdit(p)}>
                    수정
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 개발 모드 전용 도크 */}
      {isDev && (
        <div className="dev-dock">
          <button className="ai-btn ghost sm" onClick={seedNow}>
            더미추가
          </button>
          <button className="ai-btn ghost sm" onClick={clearNow}>
            비우기
          </button>
          <a className="dock-link" href="/organizer/ai-promo?seed=1">
            ?seed=1
          </a>
          <a className="dock-link" href="/organizer/ai-promo?clear=1">
            ?clear=1
          </a>
        </div>
      )}
    </main>
  );
}
