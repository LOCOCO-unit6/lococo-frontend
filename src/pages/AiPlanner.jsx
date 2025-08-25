// src/pages/AiPlanner.jsx
import React, { useState, useRef } from "react";
import "./AiPlanner.css";
import Compass from "../image/compass.png";
import { createPlanApi, updateProposal } from "../api/aiPlannerApi";

// 서버 초안을 화면 모델로 정규화
function normalizeServerPlan(d = {}) {
  const lines = (x) =>
    String(x || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

  const programLines = lines(d.program);
  const sideLines = lines(d.sideEvents);
  const blocks = [];
  if (programLines.length) {
    blocks.push({ heading: "메인 프로그램", items: programLines });
  }
  if (sideLines.length) {
    blocks.push({ heading: "부대 행사", items: sideLines });
  }

  return {
    // proposalId가 없을 때 id를 sessionId로 대체 (참고사항 반영)
    id: d.proposalId ?? d.sessionId ?? null,
    title: d.title || "무제 제안서",
    overview: lines(d.overview),
    intent: d.intentAndConcept || "",
    programBlocks: blocks,
    benefits: lines(d.expectedEffects),
    region: d.region || "",
    season: d.season || "",
    target: d.target || "",
  };
}

export default function AiPlanner() {
  const [step, setStep] = useState("form"); // form | loading | result
  const [isEditing, setIsEditing] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [proposalId, setProposalId] = useState(null); // ✅ 숫자 ID 따로 보관

  // ===== 인라인 편집용 ref =====
  const titleRef = useRef(null);
  const overviewRef = useRef(null);
  const intentRef = useRef(null);
  const programsRef = useRef(null);
  const benefitsRef = useRef(null);

  // DOM → 배열 헬퍼
  const parseUl = (ulEl) =>
    !ulEl
      ? []
      : Array.from(ulEl.querySelectorAll("li"))
          .map((li) => li.innerText.trim())
          .filter(Boolean);

  const parseProgramBlocksFromDOM = (wrapEl) => {
    if (!wrapEl) return [];
    return Array.from(wrapEl.querySelectorAll(".program-block")).map((blk) => {
      const heading = (
        blk.querySelector(".program-heading")?.innerText || ""
      ).trim();
      const items = Array.from(blk.querySelectorAll("ul > li"))
        .map((li) => li.innerText.trim())
        .filter(Boolean);
      return { heading, items };
    });
  };

  // ===== 폼 상태 =====
  const [region, setRegion] = useState("");
  const [seasons, setSeasons] = useState({
    spring: false,
    summer: true,
    autumn: false,
    winter: false,
    allYear: false,
  });
  const [tags, setTags] = useState("");
  const [localSpecialty, setLocalSpecialty] = useState("");
  const [noSpecialty, setNoSpecialty] = useState(false);
  const [intent, setIntent] = useState("");
  const [noPlan, setNoPlan] = useState(false);
  const toggleSeason = (key) =>
    setSeasons((prev) => ({ ...prev, [key]: !prev[key] }));

  // ===== 제출 → 서버 호출 =====
  const submitForm = async (e) => {
    e.preventDefault();
    setStep("loading");
    setIsEditing(false);

    try {
      const payload = {
        region,
        seasons,
        tags,
        localSpecialty,
        noSpecialty,
        intent,
        noPlan,
      };

      const res = await createPlanApi(payload);
      const normalized = normalizeServerPlan(res ?? {});
      setProposal(normalized);

      // ✅ 숫자 proposalId만 별도로 보관
      if (typeof res?.proposalId === "number") {
        setProposalId(res.proposalId);
      } else {
        setProposalId(null);
      }

      setStep("result");
    } catch (err) {
      console.error("createPlanApi failed:", err);
      alert(
        "제안서 생성에 실패했어요. 잠시 후 다시 시도하거나, 입력값을 줄여서 다시 시도해 주세요."
      );
      setStep("form");
    }
  };

  // ===== 인라인 수정 완료 → 서버 저장 =====
  const saveInlineEdits = async () => {
    // proposalId(Long) 우선, 없으면 proposal.id 숫자인지 확인
    const pid = proposalId != null ? Number(proposalId) : Number(proposal?.id);
    if (!Number.isFinite(pid)) {
      alert(
        "저장하려면 먼저 제안서를 저장해 ID를 발급받아야 합니다. (다시 생성해 주세요)"
      );
      return;
    }

    // 화면에서 최신 내용 수집
    const next = {
      ...proposal,
      title: (titleRef.current?.innerText || "").trim(),
      overview: parseUl(overviewRef.current),
      intent: (intentRef.current?.innerText || "").trim(),
      programBlocks: parseProgramBlocksFromDOM(programsRef.current),
      benefits: parseUl(benefitsRef.current),
    };
    setProposal(next);

    // summary 본문 조립 (백엔드 스펙)
    const programText = (next.programBlocks || [])
      .map(
        (b) =>
          `- ${b.heading}\n${(b.items || [])
            .map((it) => `  • ${it}`)
            .join("\n")}`
      )
      .join("\n\n");

    const summaryParts = [
      next.overview?.length ? "[축제 개요]\n" + next.overview.join("\n") : "",
      next.intent ? "[기획 의도 및 배경]\n" + next.intent : "",
      programText ? "[프로그램 구성]\n" + programText : "",
      next.benefits?.length ? "[기대효과]\n" + next.benefits.join("\n") : "",
    ].filter(Boolean);

    try {
      await updateProposal(pid, {
        title: next.title,
        region: next.region || region || "",
        season: next.season || "",
        target: next.target || "",
        summary: summaryParts.join("\n\n"),
      });
      setIsEditing(false);
      alert("저장되었습니다.");
    } catch (err) {
      console.error("updateProposal failed:", err);
      alert("수정 저장 중 오류가 발생했습니다.");
    }
  };

  // ====== 상단 타이틀/서브타이틀 ======
  const formSubtitle = "기획하고자 하는 축제 정보를 알려주세요";
  const resultSubtitle = "입력 정보를 바탕으로 기획한 AI 제안서입니다";

  return (
    <main className="ai-wrap">
      <header className="ai-head">
        {!isEditing ? (
          <>
            <h1 className="ai-title">AI 기획 도우미</h1>
            {step === "form" && <p className="ai-subtitle">{formSubtitle}</p>}
            {step === "result" && proposal && (
              <p className="ai-subtitle">{resultSubtitle}</p>
            )}
          </>
        ) : (
          <h1 className="ai-title">제안서 수정하기</h1>
        )}
      </header>

      {/* ===== 폼 ===== */}
      {step === "form" && (
        <form className="ai-form" onSubmit={submitForm}>
          <div className="field">
            <label className="label">지역</label>
            <div className="select-wrap">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">지역 선택</option>
                <option>서울특별시</option>
                <option>경기도 용인시</option>
                <option>부산광역시</option>
                <option>대구광역시</option>
                <option>제주특별자치도</option>
              </select>
              <span className="select-caret">▾</span>
            </div>
          </div>

          <div className="field">
            <span className="label">시즌</span>
            <div className="checklist">
              {[
                ["spring", "봄"],
                ["summer", "여름"],
                ["autumn", "가을"],
                ["winter", "겨울"],
                ["allYear", "상시운영"],
              ].map(([key, label]) => (
                <label key={key} className="check-item">
                  <input
                    type="checkbox"
                    checked={!!seasons[key]}
                    onChange={() =>
                      setSeasons((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">태그</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="원하는 태그를 자유롭게 입력…  ex) 연인데이트, 취미, 야경 등"
            />
          </div>

          <div className="field">
            <label className="label">지역 특산품</label>
            <input
              type="text"
              value={localSpecialty}
              onChange={(e) => setLocalSpecialty(e.target.value)}
              placeholder="지역 특산품을 입력해 주세요"
              disabled={noSpecialty}
            />
            <label className="inline">
              <input
                type="checkbox"
                checked={noSpecialty}
                onChange={() => setNoSpecialty((v) => !v)}
              />
              <span>지역 특산품 없음</span>
            </label>
          </div>

          <div className="field">
            <label className="label">간단한 설명</label>
            <textarea
              rows={6}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="기획하고자 하는 축제 내용을 간단하게 설명해 주세요."
              disabled={noPlan}
            />
            <label className="inline">
              <input
                type="checkbox"
                checked={noPlan}
                onChange={() => setNoPlan((v) => !v)}
              />
              <span>계획 없음</span>
            </label>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn primary">
              제안서 만들기
            </button>
          </div>
        </form>
      )}

      {/* ===== 로딩 ===== */}
      {step === "loading" && (
        <section className="ai-loading">
          <img src={Compass} alt="나침반 로딩" />
          <p className="loading-text">
            입력하신 바탕으로 AI가 기본 제안서를 만들고 있어요…
          </p>
        </section>
      )}

      {/* ===== 결과 ===== */}
      {step === "result" && proposal && (
        <section className="ai-result">
          <div className="paper">
            {/* 제목 */}
            <h3
              className="paper-title"
              ref={titleRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
            >
              {proposal.title}
            </h3>

            {/* 축제 개요 */}
            <div className="paper-box">
              <h4>축제 개요</h4>
              <ul
                ref={overviewRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
              >
                {(proposal.overview || []).map((li, i) => (
                  <li key={i}>{String(li).replace(/^•\s?/, "")}</li>
                ))}
              </ul>
            </div>

            {/* 기획 의도 및 배경 */}
            <div className="paper-box">
              <h4>기획 의도 및 배경</h4>
              <p
                className="para"
                ref={intentRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
              >
                {proposal.intent}
              </p>
            </div>

            {/* 프로그램 구성 */}
            <div className="paper-box" ref={programsRef}>
              <h4>프로그램 구성</h4>
              {(proposal.programBlocks || []).map((b, i) => (
                <div key={i} className="program-block">
                  <strong
                    className="program-heading"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                  >
                    {b.heading}
                  </strong>
                  <ul
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                  >
                    {(b.items || []).map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 기대효과 */}
            <div className="paper-box">
              <h4>기대효과</h4>
              <ul
                ref={benefitsRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
              >
                {(proposal.benefits || []).map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 액션 */}
          {!isEditing ? (
            <div className="btn-row center paper-actions">
              <button
                className="btn rect ghost"
                onClick={() => setIsEditing(true)}
              >
                수정하기
              </button>
              <button className="btn rect primary" onClick={saveInlineEdits}>
                저장하기
              </button>
            </div>
          ) : (
            <div className="btn-row center paper-actions">
              <button className="btn rect primary" onClick={saveInlineEdits}>
                수정 완료
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
