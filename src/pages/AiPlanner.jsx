// src/pages/AiPlanner.jsx
import React, { useState, useRef } from "react";
import "./AiPlanner.css";
import Compass from "../image/compass.png";
import { createPlanApi, updateProposal } from "../api/aiPlannerApi";

/** 서버 응답 → 화면 모델로 정규화 */
function normalizeServerPlan(data = {}) {
  const title = (data.title || data.name || data.festivalTitle || "").trim();

  const toList = (v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string")
      return v
        .split(/\r?\n|•|- |\u2022/g)
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  };

  const overview = toList(data.overview);
  const intent = (
    data.intent ||
    data.intentAndConcept ||
    data.summary ||
    ""
  ).trim();

  const programBlocks = [];
  const prog = toList(data.program);
  if (prog.length) programBlocks.push({ heading: "프로그램", items: prog });
  const side = toList(data.sideEvents);
  if (side.length) programBlocks.push({ heading: "부대행사", items: side });

  const benefits = toList(data.expectedEffects);

  if (!title && !overview.length && !intent && !programBlocks.length) {
    const err = new Error("INVALID_RESPONSE");
    err.reason = "서버 응답 필드 부족";
    throw err;
  }
  return {
    id: data.proposalId ?? data.id ?? data.planId ?? data.sessionId,
    title: title || "무제",
    overview,
    intent,
    programBlocks,
    benefits,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export default function AiPlanner() {
  const [step, setStep] = useState("form"); // form | loading | result
  const [isEditing, setIsEditing] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  const titleRef = useRef(null);
  const overviewRef = useRef(null);
  const intentRef = useRef(null);
  const programsRef = useRef(null);
  const benefitsRef = useRef(null);

  const parseUl = (ulEl) =>
    ulEl
      ? Array.from(ulEl.querySelectorAll("li"))
          .map((li) => li.innerText.trim())
          .filter(Boolean)
      : [];

  const parseProgramBlocksFromDOM = (wrapEl) =>
    wrapEl
      ? Array.from(wrapEl.querySelectorAll(".program-block")).map((blk) => {
          const heading = (
            blk.querySelector(".program-heading")?.innerText || ""
          ).trim();
          const items = Array.from(blk.querySelectorAll("ul > li"))
            .map((li) => li.innerText.trim())
            .filter(Boolean);
          return { heading, items };
        })
      : [];

  const saveInlineEdits = async () => {
    if (!proposal?.id) return setIsEditing(false);

    const next = {
      ...proposal,
      title: (titleRef.current?.innerText || "").trim(),
      overview: parseUl(overviewRef.current),
      intent: (intentRef.current?.innerText || "").trim(),
      programBlocks: parseProgramBlocksFromDOM(programsRef.current),
      benefits: parseUl(benefitsRef.current),
    };

    // 서버에 맞춰 summary로 합쳐서 저장
    const summaryParts = [];
    if (next.overview?.length)
      summaryParts.push("[개요]\n" + next.overview.join("\n"));
    if (next.intent) summaryParts.push("[의도]\n" + next.intent);
    if (next.programBlocks?.length) {
      const txt = next.programBlocks
        .map(
          (b) =>
            `- ${b.heading}\n${(b.items || [])
              .map((x) => `  • ${x}`)
              .join("\n")}`
        )
        .join("\n");
      summaryParts.push("[프로그램]\n" + txt);
    }
    if (next.benefits?.length)
      summaryParts.push(
        "[기대효과]\n" + next.benefits.map((x) => `- ${x}`).join("\n")
      );

    try {
      await updateProposal(next.id, {
        title: next.title,
        summary: summaryParts.join("\n\n"),
      });
      setProposal(next);
      setIsEditing(false);
      alert("저장되었습니다.");
    } catch (e) {
      alert("수정 저장 실패: " + (e?.response?.data?.message || e.message));
    }
  };

  // ====== 폼 상태 ======
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

  // ====== 액션(서버 호출) ======
  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setIsEditing(false);
    setStep("loading");
    setLoadingMsg("서버에 제안 생성 요청 중…");
    try {
      const payload = {
        region,
        seasons,
        tags,
        localSpecialty: noSpecialty ? null : localSpecialty,
        intent: noPlan ? "" : intent,
        noSpecialty,
        noPlan,
      };
      const res = await createPlanApi(payload);
      const normalized = normalizeServerPlan(res ?? {});
      setProposal(normalized);

      // 저장: AiPromo에서 재사용
      const key = "aiPlanner.plans";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [
        normalized,
        ...prev.filter((p) => p.id !== normalized.id),
      ].slice(0, 100);
      localStorage.setItem(key, JSON.stringify(next));

      setStep("result");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.reason ||
        "제안서 생성 실패. 입력값을 확인하거나 다시 시도해 주세요.";
      setError(msg);
      setStep("form");
    }
  };

  const download = () => {
    if (!proposal) return;
    const text = [
      `제목: ${proposal.title}`,
      "",
      "[축제 개요]",
      ...(proposal.overview || []),
      "",
      "[기획 의도 및 배경]",
      proposal.intent || "",
      "",
      "[프로그램 구성]",
      ...(proposal.programBlocks || []).flatMap((b) => [
        `- ${b.heading}`,
        ...(b.items || []).map((it) => `  • ${it}`),
        "",
      ]),
      "[기대효과]",
      ...(proposal.benefits || []).map((b) => `- ${b}`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_제안서.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formSubtitle = "기획하고자 하는 축제 정보를 알려주세요";
  const resultSubtitle = "서버 응답 기반 AI 제안서입니다";

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
            {error && step === "form" && (
              <p className="ai-error" role="alert" style={{ color: "#d44" }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <h1 className="ai-title">제안서 수정하기</h1>
        )}
      </header>

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
                    onChange={() => toggleSeason(key)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">태그(콤마구분)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예) 가족, 야외공연, 야시장"
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

      {step === "loading" && (
        <section className="ai-loading">
          <img src={Compass} alt="나침반 로딩" />
          <p className="loading-text">{loadingMsg || "처리 중…"}</p>
        </section>
      )}

      {step === "result" && proposal && (
        <section className="ai-result">
          <div className="paper">
            <h3
              className="paper-title"
              ref={titleRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
            >
              {proposal.title}
            </h3>

            <div className="paper-box">
              <h4>축제 개요</h4>
              <ul
                ref={overviewRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
              >
                {(proposal.overview || []).map((li, i) => (
                  <li key={i}>{li.replace(/^•\s?/, "")}</li>
                ))}
              </ul>
            </div>

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

          {!isEditing ? (
            <div className="btn-row center paper-actions">
              <button
                className="btn rect ghost"
                onClick={() => setIsEditing(true)}
              >
                수정하기
              </button>
              <button className="btn rect primary" onClick={download}>
                다운로드
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
