// src/pages/AiPromoStart.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AiPromotion.css";
import { listPlansApi } from "../utils/Api";

function normalizePlan(p) {
  const title = p.title || p.name || p.festivalTitle || "무제";
  const region = p.region || p.location || p.city || "미정";
  const season = p.season || p.seasonality || "미정";
  const target = p.target || p.audience || "미정";
  const date =
    p.date ||
    p.eventDate ||
    (p.createdAt && String(p.createdAt).slice(0, 10)) ||
    "YYYY-MM-DD";
  const id = p.id || p._id;
  return { id, title, region, season, target, date, raw: p };
}

export default function AiPromoStart() {
  const nav = useNavigate();
  const [search] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const res = await listPlansApi({ page: 1, size: 50 }); // 필요시 파라미터 조절
        const list = Array.isArray(res?.data?.items)
          ? res.data.items
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setPlans(list);
      } catch (e) {
        setError(e?.response?.data?.message || "기획서 목록 조회 실패");
        setPlans([]);
      }
    })();
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

  return (
    <main className="ai-promo-wrap">
      <h1 className="ai-promo-title">AI 홍보 콘텐츠 생성</h1>
      <p className="ai-promo-subtitle">생성할 홍보 콘텐츠 정보를 알려주세요</p>

      <section className="ai-promo-card ai-promo-start-card">
        <h3 className="start-title">
          홍보물 생성을 원하는 콘텐츠를 선택 해주세요
        </h3>

        {error && (
          <p className="ai-error" style={{ color: "#d44" }}>
            {error}
          </p>
        )}

        {list.length === 0 && !error && (
          <div className="start-empty">
            <div className="start-empty-box">
              <div className="start-empty-text">
                먼저 기획서를 생성해 주세요
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
