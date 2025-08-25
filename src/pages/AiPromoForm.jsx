// src/pages/AiPromoForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";
import { generatePromoApi } from "../utils/Api";

export default function AiPromoForm() {
  const nav = useNavigate();

  // Start에서 넣어둔 선택 기획서(plan)
  const plan = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("aiPromo.plan") || "null");
    } catch {
      return null;
    }
  }, []);

  // 입력값
  const [intro, setIntro] = useState(""); // 해시태그/요약처럼 보이던 필드 (추가문구에 보탤 예정)
  const [headline, setHeadline] = useState(""); // 대표 문구
  const [detail, setDetail] = useState(""); // 세부 내용
  const [error, setError] = useState("");

  // 화면 진입 시 기본 안내문 생성(표시용)
  useEffect(() => {
    if (!plan) return;
    const title = plan.title || plan.name || plan.festivalTitle || "무제";
    const date =
      plan.date ||
      plan.eventDate ||
      (plan.createdAt && String(plan.createdAt).slice(0, 10)) ||
      "YYYY-MM-DD";
    const region = plan.region || plan.location || plan.city || "미정";
    const place = plan.place || plan.venue || region;
    const season = plan.season || plan.seasonality || "미정";
    const target = plan.target || plan.audience || "미정";
    setIntro(`${title} / ${date} / ${place} / 시즌:${season} / 타겟:${target}`);
  }, [plan]);

  // ✅ Swagger에 맞춰 proposalId + additionalText 로 호출
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // proposalId는 선택한 기획서 id 사용 (숫자/문자 모두 허용, 서버가 숫자라면 백엔드에서 캐스팅)
    const proposalId = plan?.id ?? plan?._id;
    if (!proposalId) {
      setError("선택된 기획서가 없습니다.");
      return;
    }

    // additionalText: 사용자가 입력한 대표문구 + 세부내용 + 화면상 요약을 한 줄로 합침
    const additionalText = [headline, detail, intro].filter(Boolean).join(" ");

    try {
      const res = await generatePromoApi(proposalId, additionalText);
      const data = res?.data ?? res; // { instagramId, title, content, hashtags: [] }

      // Results 화면에서 재사용 (배열 형태로 저장)
      sessionStorage.setItem("aiPromo.items", JSON.stringify([data]));
      sessionStorage.setItem(
        "aiPromo.promotionId",
        String(data.instagramId ?? data.id ?? "")
      );

      nav("/organizer/ai-promo/results");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "홍보 콘텐츠 생성 실패"
      );
    }
  };

  const info = {
    title: plan?.title || plan?.name || plan?.festivalTitle || "무제",
    slogan: plan?.slogan || plan?.tagline || " ",
    date:
      plan?.date ||
      plan?.eventDate ||
      (plan?.createdAt && String(plan?.createdAt).slice(0, 10)) ||
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
        {error && (
          <p className="ai-error" style={{ color: "#d44" }}>
            {error}
          </p>
        )}
      </div>

      <section className="ai-promo-card" style={{ maxWidth: 880 }}>
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

        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label>
              대표 문구 (추가문구에 포함) <span className="req"></span>
            </label>
            <input
              placeholder="대표 문구를 작성해 주세요"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>세부 내용 (추가문구에 포함)</label>
            <textarea
              placeholder="세부 내용을 작성해 주세요"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>요약/메모 (추가문구에 포함)</label>
            <textarea
              placeholder="필요하면 적어주세요"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
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
