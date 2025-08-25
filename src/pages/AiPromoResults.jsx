// src/pages/AiPromoResults.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";
import { savePromoPickApi } from "../utils/Api";

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
  const [active, setActive] = useState(0);

  if (!items.length) {
    return (
      <main className="ai-promo-wrap">
        <h1 className="ai-promo-title" style={{ textAlign: "center" }}>
          AI 홍보 콘텐츠 생성
        </h1>
        <p style={{ textAlign: "center" }}>
          결과가 없습니다. 다시 생성해 주세요.
        </p>
      </main>
    );
  }

  const onSave = async () => {
    const pick = items[active];
    try {
      await savePromoPickApi(promotionId || pick.id, {
        title: pick.title,
        body: pick.content,
        mode: "instagram",
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

      <div className="result-deck portrait">
        {items.map((it, i) => (
          <article
            key={it.id || i}
            className={`result-card3 ${i === active ? "is-front" : "is-back"}`}
            onClick={() => setActive(i)}
          >
            <div className="card-inner">
              <h4>{it.title}</h4>
              <pre>{it.content}</pre>
              <div>#{it.hashtags}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="result-actions">
        <button className="ai-btn primary square" onClick={onSave}>
          선택 저장하기
        </button>
      </div>
    </main>
  );
}
