// src/pages/AiPromoResults.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";
import { savePromoPickApi } from "../utils/Api";

const chipBase = {
  border: "1px solid var(--line,#e5e7eb)",
  background: "#fff",
  color: "#444",
  padding: "8px 16px",
  borderRadius: 999,
  fontWeight: 700,
  cursor: "pointer",
};
const chipActive = {
  background: "var(--brand,#ff7f30)",
  color: "#fff",
  borderColor: "var(--brand,#ff7f30)",
};

export default function AiPromoResults() {
  const nav = useNavigate();
  const items = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("aiPromo.items") || "[]");
    } catch {
      return [];
    }
  }, []);
  const promotionId = useMemo(
    () => sessionStorage.getItem("aiPromo.promotionId") || "",
    []
  );
  const [mode, setMode] = useState("instagram"); // 모드 값은 선택 UI만 유지 (서버 결과는 동일)
  const [active, setActive] = useState(0);

  if (!items.length) {
    return (
      <main className="ai-promo-wrap">
        <h1 className="ai-promo-title" style={{ textAlign: "center" }}>
          AI 홍보 콘텐츠 생성
        </h1>
        <p style={{ textAlign: "center" }}>
          결과가 없습니다. 폼으로 돌아가 다시 생성해 주세요.
        </p>
      </main>
    );
  }

  const leftIndex = (active + items.length - 1) % items.length;
  const rightIndex = (active + 1) % items.length;

  const bringToFront = (idx) => {
    if (idx !== active) setActive(idx);
  };

  const onEdit = () => {
    const pick = items[active];
    sessionStorage.setItem("aiPromo.pick", JSON.stringify(pick));
    nav("/organizer/ai-promo/editor");
  };

  const onSave = async () => {
    const pick = items[active];
    try {
      await savePromoPickApi(promotionId || pick.id, {
        body: pick.body,
        title: pick.title,
        mode,
      });
      alert("선택한 결과를 서버에 저장했습니다.");
    } catch (e) {
      alert("저장 실패: " + (e?.response?.data?.message || e.message));
    }
  };

  return (
    <main className="ai-promo-wrap">
      <h1 className="ai-promo-title" style={{ textAlign: "center" }}>
        AI 홍보 콘텐츠 생성
      </h1>

      <div
        className="result-tabs"
        style={{
          top: 84,
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          padding: "8px 0",
          margin: "8px 0",
          background: "#fff",
        }}
      >
        <button
          style={{ ...chipBase, ...(mode === "instagram" ? chipActive : {}) }}
          onClick={() => {
            setMode("instagram");
          }}
        >
          인스타
        </button>
        <button
          style={{ ...chipBase, ...(mode === "blog" ? chipActive : {}) }}
          onClick={() => {
            setMode("blog");
          }}
        >
          블로그
        </button>
      </div>

      <div className="result-deck portrait">
        {items.map((it, i) => {
          let pos = "pos-center";
          if (i === leftIndex) pos = "pos-left";
          if (i === rightIndex) pos = "pos-right";
          if (i !== active && i !== leftIndex && i !== rightIndex)
            pos = "pos-hidden";
          return (
            <article
              key={it.id || i}
              className={`result-card3 ${pos} ${
                i === active ? "is-front" : "is-back"
              }`}
              onClick={() => bringToFront(i)}
            >
              <div className="card-inner">
                <h4>{it.title}</h4>
                <pre>{it.body}</pre>
              </div>
            </article>
          );
        })}
      </div>

      <div className="result-actions">
        <button className="ai-btn ghost square" onClick={onEdit}>
          선택 수정하기
        </button>
        <button className="ai-btn primary square" onClick={onSave}>
          선택 저장하기
        </button>
      </div>
    </main>
  );
}
