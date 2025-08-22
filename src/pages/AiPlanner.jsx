// src/pages/AiPlanner.jsx
import React, { useState, useRef } from "react";
import "./AiPlanner.css";
import Compass from "../image/compass.png";

/** 폼 → 제안서 더미 생성기 (추후 API 연동 전 임시) */
function createProposalFromInputs({
  region,
  seasons,
  tags,
  localSpecialty,
  noSpecialty,
  intent,
  noPlan,
}) {
  const seasonLabel = {
    spring: "봄",
    summer: "여름",
    autumn: "가을",
    winter: "겨울",
    allYear: "상시운영",
  };
  const seasonList = Object.entries(seasons)
    .filter(([, v]) => v)
    .map(([k]) => seasonLabel[k] || "");

  const title =
    tags && tags.trim()
      ? `${region || "지역"} ${seasonList.join("·") || ""} 키워드: ${tags}`
      : `${region || "지역"} ${seasonList.join("·") || ""} 기획`;

  return {
    title: (title || "기흥 뮤직 파티: 젊음을 노래하는 여름밤의 축제").trim(),
    overview: [
      `• 축제명: ${title || "기흥 뮤직 파티 (Giheung Music Party)"}`,
      `• 요약: ${(intent && intent.trim()) || "젊음을 노래하는 여름밤의 축제"}`,
      `• 일시: 2025년 8월 23일(토) ~ 2025년 8월 24일(일) (2일간)`,
      `• 장소: ${region || "용인시 기흥구"} 시민공원 일대`,
      `• 타깃: 음악을 사랑하는 20대 남녀노소 (연인, 사회초년생 등)`,
    ],
    intent:
      (intent && intent.trim()) ||
      `기흥구는 젊은층 유입이 활발한 도시입니다. 하지만 20대들이 즐길 수 있는 문화 콘텐츠가 부족한 상황입니다. 이에 기흥구만의 색을 담은 소규모 음악 페스티벌을 기획하여 통일된 시그니처 프로그램을 선보이고, 지역에 대한 긍정적 자부심을 높이고자 합니다.`,
    programBlocks: [
      {
        heading: "메인 무대 (Main Stage)",
        items: [
          "인디/밴드&신진 뮤지션 공연",
          "DJ 파티: 힙합, 일렉트로닉 등 EDM 중심",
          "푸드트럭·로컬 베버리지 페어",
        ],
      },
      {
        heading: "참여형 부대 행사",
        items: [
          `느린마켓/로컬마켓: ${
            noSpecialty ? "지역 상권 연계" : localSpecialty || "특산물"
          } 특화 부스`,
          "포토존·관객 참여형 포토콘테스트",
          "아티스트 사인회/팬미팅",
        ],
      },
    ],
    benefits: [
      "젊은층 유입 및 지역 활성화",
      "도시/브랜드 이미지 제고",
      "로컬 상권과의 동반 성장",
      "연례행사로의 확장 가능성",
    ],
  };
}

export default function AiPlanner() {
  /* ====== 단계: form | loading | result ====== */
  const [step, setStep] = useState("form");
  /* ====== 인라인 편집 토글 ====== */
  const [isEditing, setIsEditing] = useState(false);
  /* ====== 결과(제안서) ====== */
  const [proposal, setProposal] = useState(null);

  /* ====== contentEditable 참조 ====== */
  const titleRef = useRef(null);
  const overviewRef = useRef(null);
  const intentRef = useRef(null);
  const programsRef = useRef(null);
  const benefitsRef = useRef(null);

  // <ul> → string[]
  const parseUl = (ulEl) => {
    if (!ulEl) return [];
    return Array.from(ulEl.querySelectorAll("li"))
      .map((li) => li.innerText.trim())
      .filter(Boolean);
  };

  // .program-block 묶음 → [{heading, items}]
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

  // 편집 저장: DOM → state 반영
  const saveInlineEdits = () => {
    if (!proposal) return;
    const next = {
      ...proposal,
      title: (titleRef.current?.innerText || "").trim(),
      overview: parseUl(overviewRef.current),
      intent: (intentRef.current?.innerText || "").trim(),
      programBlocks: parseProgramBlocksFromDOM(programsRef.current),
      benefits: parseUl(benefitsRef.current),
    };
    setProposal(next);
    setIsEditing(false);
  };

  /* ====== 폼 상태 ====== */
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

  /* ====== 액션 ====== */
  const submitForm = (e) => {
    e.preventDefault();
    setStep("loading");
    setIsEditing(false);
    setTimeout(() => {
      const p = createProposalFromInputs({
        region,
        seasons,
        tags,
        localSpecialty,
        noSpecialty,
        intent,
        noPlan,
      });
      setProposal(p);
      setStep("result");
    }, 900);
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

      {/* ====== 입력 폼 ====== */}
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

      {/* ====== 로딩 ====== */}
      {step === "loading" && (
        <section className="ai-loading">
          <img src={Compass} alt="나침반 로딩" />
          <p className="loading-text">
            입력하신 바탕으로 AI가 기본 제안서를 만들고 있어요…
          </p>
        </section>
      )}

      {/* ====== 결과(보기/인라인수정) ====== */}
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
                {proposal.overview.map((li, i) => (
                  <li key={i}>{li.replace(/^•\s?/, "")}</li>
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
              {proposal.programBlocks.map((b, i) => (
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
                    {b.items.map((it, j) => (
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
                {proposal.benefits.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 버튼: 보기/수정 토글 + 저장 */}
          {!isEditing ? (
            <div className="btn-row center paper-actions">
              <button
                className="btn rect ghost"
                onClick={() => setIsEditing(true)}
              >
                수정하기
              </button>
              <button className="btn rect primary" onClick={download}>
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
