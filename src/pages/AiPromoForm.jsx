// src/pages/AiPromoForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";

export default function AiPromoForm() {
  const nav = useNavigate();
  const plan = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("aiPromo.plan") || "null");
    } catch {
      return null;
    }
  }, []);

  // 선택한 기획서로 입력값 프리필
  const [intro, setIntro] = useState("");
  const [headline, setHeadline] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (!plan) return;
    const title = plan.title || plan.name || plan.festivalTitle || "무제";
    const slogan = plan.slogan || plan.tagline || "";
    const date =
      plan.date ||
      plan.eventDate ||
      (plan.createdAt && String(plan.createdAt).slice(0, 10)) ||
      "YYYY-MM-DD";
    const region = plan.region || plan.location || plan.city || "미정";
    const place = plan.place || plan.venue || region;
    const season = plan.season || plan.seasonality || "미정";
    const target = plan.target || plan.audience || "미정";

    // 상단 요약은 info-box에서 렌더링, 입력 기본값은 깔끔히
    setIntro(`${title} / ${date} / ${place} / 시즌:${season} / 타겟:${target}`);
    setHeadline(plan.headline || "");
    setDetail(plan.detail || "");
  }, [plan]);

  const onSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem(
      "aiPromo.form",
      JSON.stringify({ intro, headline, detail })
    );
    nav("/organizer/ai-promo/loading");
  };

  // 상단 요약용 안전 값
  const info = {
    title: plan?.title || plan?.name || plan?.festivalTitle || "무제",
    slogan: plan?.slogan || plan?.tagline || " ",
    date:
      plan?.date ||
      plan?.eventDate ||
      (plan?.createdAt && String(plan.createdAt).slice(0, 10)) ||
      "YYYY-MM-DD",
    place:
      plan?.place || plan?.venue || plan?.region || plan?.location || "미정",
    target: plan?.target || plan?.audience || "미정",
  };

  return (
    <main className="ai-promo-wrap">
      <div className="ai-promo-head">
        <h1 className="ai-promo-title">AI 홍보 콘텐츠 생성</h1>
        <p className="ai-promo-subtitle">
          생성할 홍보 콘텐츠 정보를 알려주세요
        </p>
      </div>

      <section className="ai-promo-card" style={{ maxWidth: 880 }}>
        {/* ✅ 축제 정보 요약 박스 */}
        <div className="info-box">
          <div className="info-title">
            {info.title}
            {info.slogan ? `: ${info.slogan}` : ""}
          </div>
          <ul className="info-list">
            <li>
              <b>축제명:</b> {info.title}
            </li>
            {info.slogan && (
              <li>
                <b>슬로건:</b> {info.slogan}
              </li>
            )}
            <li>
              <b>일시:</b> {info.date}
            </li>
            <li>
              <b>장소:</b> {info.place}
            </li>
            <li>
              <b>타겟:</b> {info.target}
            </li>
          </ul>
        </div>

        {/* ✅ 입력 폼 */}
        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label>
              원하는 대표 글귀 문구(키워드) <span className="req"></span>
            </label>
            <input
              placeholder="들어가길 원하는 문구(키워드)를 작성해 주세요"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>원하는 세부 내용 문구(키워드)</label>
            <textarea
              placeholder="들어가길 원하는 문구(키워드)를 작성해 주세요"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
            <div className="note">*미작성시 AI가 알아서 생성</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 22 }}>
            <button className="ai-btn primary lg square" type="submit">
              생성하기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
