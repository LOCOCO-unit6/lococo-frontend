// src/pages/AiPromoResults.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";
const chipBase = {
  border: "1px solid var(--line, #e5e7eb)",
  background: "#fff",
  color: "#444",
  padding: "8px 16px",
  borderRadius: 999,
  fontWeight: 700,
  cursor: "pointer",
};
const chipActive = {
  background: "var(--brand, #ff7f30)",
  color: "#fff",
  borderColor: "var(--brand, #ff7f30)",
};

function buildItems(mode, form) {
  const base = form?.intro || "2025 지역 축제 기본 소개";
  const head = form?.headline || "가을빛 물든 밤, 가족과 함께";

  const ig = [
    {
      id: "ig-a",
      title: "인스타 버전 A",
      body:
        `🎵 무더운 여름밤, 음악과 함께 젊음을 노래할 시간!\n\n${base}\n\n` +
        `✅ 포인트\n• 일시: ${new Date()
          .toISOString()
          .slice(0, 10)}\n• 장소: 현장 야외무대\n\n` +
        `#가을축제 #야외무대 #버스킹 #${head.replace(/\s+/g, "")}`,
    },
    {
      id: "ig-b",
      title: "인스타 버전 B",
      body: `💡 ${head}\n\n${base}\n\n📌 드레스코드: 오렌지 포인트\n#Festival #Family #Memory`,
    },
    {
      id: "ig-c",
      title: "인스타 버전 C",
      body: `✨ 특별한 주말, ${head}\n\n${base}\n\n🎫 선착순 굿즈 증정!\n#용인축제 #야외공연 #굿즈`,
    },
  ];

  const blog = [
    {
      id: "blog-a",
      title: "블로그 버전 A",
      body:
        `🎵 ${head}\n\n푸른 잔디와 시원한 바람을 맞으며 즐기는 음악은 남다른 여름의 기억을 선물합니다. ` +
        `친구, 연인과 함께 맞이할 잊지 못할 주말을 준비해 보세요.\n\n` +
        `✅ 기흥 뮤직 파티\n• 일시: ${new Date()
          .toISOString()
          .slice(
            0,
            10
          )} (금) - (토)\n• 장소: 기흥구 시민체육공원 야외무대\n\n` +
        `#기흥뮤직파티 #야외공연 #버스킹`,
    },
    {
      id: "blog-b",
      title: "블로그 버전 B",
      body:
        `🎈 ${base}\n\n올여름 가장 시원한 밤을 선사할 라인업과 푸드트럭, 체험부스까지 한자리에. ` +
        `아이와 함께, 혹은 친구와 함께 와도 충분히 즐길 거리들이 가득합니다.\n\n#축제 #체험부스 #푸드`,
    },
    {
      id: "blog-c",
      title: "블로그 버전 C",
      body:
        `✨ ${head}\n\n모던 타이포 스타일 포스터와 함께 SNS 업로드용 해시태그까지 한 번에 준비해 드립니다. ` +
        `현장에서 바로 사용할 수 있는 멘트로 간편하게 홍보해 보세요.\n\n#포스터 #SNS #현장홍보`,
    },
  ];

  return mode === "instagram" ? ig : blog;
}

export default function AiPromoResults() {
  const nav = useNavigate();
  const form = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("aiPromo.form") || "null");
    } catch {
      return null;
    }
  }, []);

  const [mode, setMode] = useState("instagram");
  const [active, setActive] = useState(0);
  const items = useMemo(() => buildItems(mode, form), [mode, form]);

  const leftIndex = (active + items.length - 1) % items.length;
  const rightIndex = (active + 1) % items.length;

  const bringToFront = (idx) => {
    if (idx === active) return;
    setActive(idx);
  };

  const onEdit = () => {
    const pick = items[active];
    sessionStorage.setItem("aiPromo.pick", JSON.stringify(pick));
    nav("/organizer/ai-promo/editor");
  };

  const onSave = () => {
    const pick = items[active];
    const key = "aiPromo.saved";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(
      key,
      JSON.stringify([...prev, { ...pick, mode, at: Date.now() }])
    );
    alert("선택한 결과를 보관함에 저장했습니다.");
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
            setActive(0);
          }}
        >
          인스타
        </button>
        <button
          style={{ ...chipBase, ...(mode === "blog" ? chipActive : {}) }}
          onClick={() => {
            setMode("blog");
            setActive(0);
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
              key={it.id}
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
