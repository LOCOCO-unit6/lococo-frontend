// src/pages/AiPromoStart.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AiPromotion.css";

/** ---- 저장/로드 유틸 ---- */
const STORAGE_KEY = "aiPlanner.plans";
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
function clearPlans() {
  CANDIDATE_KEYS.forEach((k) => localStorage.removeItem(k));
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
    if (search.get("clear") === "1") clearPlans();
    setPlans(loadPlans());
  }, [search]);

  const list = useMemo(() => plans.map(normalizePlan), [plans]);

  const goPlanner = () => nav("/AiPlanner");

  // ✅ organizerId 주입
  const goToForm = (plan) => {
    const raw = plan.raw || plan;
    const orgId =
      raw?.organizerId ??
      raw?.organizer?.id ??
      plan?.organizerId ??
      plan?.organizer?.id ??
      null;

    if (orgId != null) {
      localStorage.setItem("organizerId", String(orgId));
      sessionStorage.setItem("organizerId", String(orgId));
    }

    sessionStorage.setItem("aiPromo.plan", JSON.stringify(raw));
    nav("/organizer/ai-promo/form");
  };

  const goDetail = (plan) =>
    nav(`/AiPlanner?planId=${encodeURIComponent(plan.id)}`);
  const goEdit = (plan) =>
    nav(`/AiPlanner?planId=${encodeURIComponent(plan.id)}&edit=1`);

  return (
    <main className="ai-promo-wrap">
      <h1 className="ai-promo-title">AI 홍보 콘텐츠 생성</h1>
      <p className="ai-promo-subtitle">생성할 홍보 콘텐츠 정보를 알려주세요</p>

      <section className="ai-promo-card ai-promo-start-card">
        <h3 className="start-title">
          홍보물 생성을 원하는 콘텐츠를 선택 해주세요
        </h3>

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
    </main>
  );
}
