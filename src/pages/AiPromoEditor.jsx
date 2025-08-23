import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";

/** 본문을 (대표글귀 / 세부내용 / 해시태그)로 가볍게 분리 */
function parseContent(body = "") {
  const parts = body.split("\n");
  const hashLines = parts.filter((l) => l.trim().startsWith("#"));
  const otherLines = parts.filter((l) => !l.trim().startsWith("#"));
  const headline = (otherLines[0] || "").trim();
  const detail = otherLines.slice(1).join("\n").trim();
  const hashtags = hashLines.join(" ").trim();
  return { headline, detail, hashtags };
}

export default function AiPromoEditor() {
  const nav = useNavigate();
  const pick = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("aiPromo.pick") || "null");
    } catch {
      return null;
    }
  }, []);

  // 초기값 파싱
  const {
    headline: h0,
    detail: d0,
    hashtags: t0,
  } = useMemo(() => parseContent(pick?.body || ""), [pick]);

  const [headline, setHeadline] = useState(h0 || "");
  const [detail, setDetail] = useState(d0 || "");
  const [hashtags, setHashtags] = useState(t0 || "");

  // 미리보기 합성
  const preview = useMemo(() => {
    const head = headline?.trim() || h0 || "";
    const det = detail?.trim() || d0 || "";
    const tag = hashtags?.trim() || "";
    return [head, det, tag].filter(Boolean).join("\n\n");
  }, [headline, detail, hashtags, h0, d0]);

  useEffect(() => {
    // pick이 없으면 결과로 복귀
    if (!pick) nav("/organizer/ai-promo/results");
  }, [pick, nav]);

  const onDone = () => {
    const next = {
      ...(pick || {}),
      body: preview,
      title: pick?.title || "편집 버전",
    };
    sessionStorage.setItem("aiPromo.pick", JSON.stringify(next));
    alert("수정 내용을 적용했습니다.");
    nav("/organizer/ai-promo/results");
  };

  return (
    <main className="ai-promo-wrap">
      <h1 className="ai-promo-title" style={{ textAlign: "center" }}>
        AI 홍보 콘텐츠 생성
      </h1>

      <section className="editor-grid">
        {/* 좌측: 미리보기 */}
        <div className="editor-preview">
          <pre className="pre-scroll">{preview}</pre>
        </div>

        {/* 우측: 수정 패널들 */}
        <div className="editor-right">
          <div className="editor-panel">
            <div className="panel-title">대표 글귀 수정</div>
            <input
              className="panel-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="예) 🎵 무더운 여름밤, 음악과 함께 젊음을 노래할 시간!"
            />
          </div>

          <div className="editor-panel">
            <div className="panel-title">세부 내용 수정</div>
            <textarea
              className="panel-textarea"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="본문을 자유롭게 수정하세요."
              rows={8}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-title">해시태그 수정</div>
            <input
              className="panel-input"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#기흥뮤직파티 #용인 #가을축제"
            />
          </div>
        </div>
      </section>

      {/* 하단 우측 버튼 */}
      <div className="editor-actions right">
        <button className="ai-btn primary square lg" onClick={onDone}>
          수정 완료
        </button>
      </div>
    </main>
  );
}
