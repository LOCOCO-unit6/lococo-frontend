// src/pages/ContentCreate.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ContentCreate.css";
import Compass from "../image/compass.png";
import { createContent } from "../api/contents"; // ✅ API 연동 (폴백 없음)

/** 작은 유틸들 */
const ORANGE = "#ff7f30";
const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const placeholderImg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='900'>
      <defs>
        <pattern id='c' width='40' height='40' patternUnits='userSpaceOnUse'>
          <rect width='40' height='40' fill='#f6f6f6'/>
          <path d='M0 0h40v40H0z M0 0l40 40 M40 0L0 40' stroke='#e6e6e6' stroke-width='1'/>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#c)'/>
    </svg>`
  );

/** 제출 상태 */
const STAGES = {
  FORM: "FORM",
  SUBMITTING: "SUBMITTING",
  DONE: "DONE",
};

export default function ContentCreate() {
  const nav = useNavigate();
  const fileInputRef = useRef(null);

  // 기본 정보
  const [title, setTitle] = useState(""); // (좌) '축제명'
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [region, setRegion] = useState("");
  const [org, setOrg] = useState("");

  // 콘텐츠 상세
  const [cardTitle, setCardTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]); // {id, src, file}

  // 진행 상태
  const [stage, setStage] = useState(STAGES.FORM);

  // 이탈 방지: 제출 중 새로고침/이동 경고
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (stage === STAGES.SUBMITTING) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [stage]);

  // 메모리 누수 방지: 썸네일 URL revoke
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.src));
    };
  }, [images]);

  const valid = useMemo(() => {
    return (
      title.trim() &&
      category &&
      startDate &&
      endDate &&
      region &&
      cardTitle.trim()
    );
  }, [title, category, startDate, endDate, region, cardTitle]);

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.slice(0, 5 - images.length).map((file, idx) => {
      return {
        id: `${Date.now()}_${idx}`,
        file,
        src: URL.createObjectURL(file),
      };
    });
    setImages((prev) => [...prev, ...next].slice(0, 5));
    e.target.value = "";
  };

  const removeImage = (id) =>
    setImages((prev) => prev.filter((x) => x.id !== id));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;

    // 간단한 기간 검증
    if (new Date(startDate) > new Date(endDate)) {
      alert("시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    setStage(STAGES.SUBMITTING);
    try {
      // ✅ API가 객체 형태(payload: {fields, files})를 받도록 래핑되어 있다고 가정
      const payload = {
        fields: {
          title, // 축제명
          category, // 카테고리(축제/전시/공연/체험)
          startDate, // 시작일(YYYY-MM-DD)
          endDate, // 종료일(YYYY-MM-DD)
          region, // 지역(서울/경기/인천...)
          organization: org, // 주관 단체
          cardTitle, // 카드/홍보 제목
          description: desc, // 설명(에디터)
        },
        files: images.map((i) => i.file), // 이미지 배열
      };

      // 🔥 폴백 없이 실제 호출
      await createContent(payload);

      setStage(STAGES.DONE);
    } catch (err) {
      console.error(err);
      // 친절한 에러 메시지
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "등록 중 오류가 발생했습니다";
      alert(msg);
      setStage(STAGES.FORM);
    }
  };

  if (stage === STAGES.SUBMITTING) {
    return (
      <div className="cc-wrap">
        <h1 className="cc-title">콘텐츠 등록</h1>
        <div className="cc-center">
          <div className="cc-progress-icon" aria-hidden>
            <section className="ai-loading">
              <img src={Compass} alt="나침반 로딩" />
              <p className="loading-text">콘텐츠 등록하는 중..</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (stage === STAGES.DONE) {
    return (
      <div className="cc-wrap">
        <h1 className="cc-title">콘텐츠 등록</h1>
        <div className="cc-center">
          <div className="cc-done-icon" aria-hidden>
            {/* 체크 아이콘 */}
            <svg viewBox="0 0 100 100" width="72" height="72">
              <circle cx="50" cy="50" r="36" fill={ORANGE} opacity="0.1" />
              <path
                d="M35 52l10 10 20-24"
                fill="none"
                stroke={ORANGE}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="cc-done-text">등록 완료 되었습니다</div>

          <div className="cc-done-actions">
            <button
              className="cc-btn cc-btn-outline"
              onClick={() => window.location.reload()}
              type="button"
            >
              다른 기획 생성
            </button>
            <button
              className="cc-btn"
              onClick={() => nav("/OrganizerMainPage")}
              type="button"
            >
              확인하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FORM 화면
  return (
    <div className="cc-wrap">
      <h1 className="cc-title">콘텐츠 등록</h1>
      <p className="cc-subtitle">등록할 콘텐츠 정보를 입력해 주세요</p>

      <form className="cc-grid" onSubmit={onSubmit}>
        {/* ===== 왼쪽 영역 ===== */}
        <section className="cc-left">
          {/* 섹션 타이틀 */}
          <h2 className="cc-section-title">기본 정보</h2>

          <div className="cc-row">
            <label className="cc-label">축제명</label>
            <input
              className="cc-input"
              placeholder="축제명 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="cc-row cc-row-2">
            <div>
              <label className="cc-label">카테고리</label>
              <select
                className="cc-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">카테고리 선택</option>
                <option value="축제">축제</option>
                <option value="전시">전시</option>
                <option value="공연">공연</option>
                <option value="체험">체험</option>
              </select>
            </div>
            <div>
              <label className="cc-label">기간</label>
              <div className="cc-date-group">
                <input
                  type="date"
                  className="cc-input"
                  value={formatDate(startDate)}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <span className="cc-date-dash">~</span>
                <input
                  type="date"
                  className="cc-input"
                  value={formatDate(endDate)}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="cc-row cc-row-2">
            <div>
              <label className="cc-label">지역</label>
              <select
                className="cc-input"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              >
                <option value="">지역 선택</option>
                <option>서울</option>
                <option>경기</option>
                <option>인천</option>
                <option>강원</option>
                <option>충청</option>
                <option>전라</option>
                <option>경상</option>
                <option>제주</option>
              </select>
            </div>
            <div>
              <label className="cc-label">주관 단체</label>
              <input
                className="cc-input"
                placeholder="기관명 입력"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
              />
            </div>
          </div>

          <h2 className="cc-section-title">콘텐츠 상세</h2>

          <div className="cc-row">
            <label className="cc-label">제목</label>
            <input
              className="cc-input"
              placeholder="홍보용 제목 입력"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              maxLength={60}
              required
            />
          </div>

          <div className="cc-row">
            <label className="cc-label">설명 (에디터)</label>
            <textarea
              className="cc-input cc-textarea"
              placeholder="홍보용 설명을 입력해 주세요"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className="cc-row">
            <label className="cc-label">사진 첨부</label>

            <div className="cc-uploader">
              <button
                type="button"
                className="cc-btn cc-btn-outline cc-btn-small"
                onClick={() => fileInputRef.current?.click()}
              >
                사진 첨부
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={onPickFiles}
              />

              <div className="cc-thumbs">
                {images.map((img) => (
                  <div className="cc-thumb" key={img.id}>
                    <img src={img.src} alt="첨부 미리보기" />
                    <button
                      type="button"
                      className="cc-thumb-del"
                      onClick={() => removeImage(img.id)}
                      aria-label="이미지 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* 자리가 비면 빈 슬롯 표시(디자인 맞춤) */}
                {Array.from({ length: Math.max(0, 3 - images.length) }).map(
                  (_, i) => (
                    <div className="cc-thumb cc-thumb-empty" key={`e${i}`} />
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 오른쪽 미리보기 ===== */}
        <aside className="cc-right">
          <div className="cc-preview">
            <div className="cc-preview-media">
              <img
                src={images[0]?.src || placeholderImg}
                alt="미리보기 이미지"
              />
            </div>
            <div className="cc-preview-body">
              <div className="cc-preview-label">제목</div>
              <div className="cc-preview-title">{cardTitle || "제목"}</div>

              <div className="cc-preview-label">설명</div>
              <div className="cc-preview-desc">{desc || "설명"}</div>
            </div>
          </div>

          <div className="cc-actions">
            <button className="cc-btn" disabled={!valid}>
              등록하기
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
