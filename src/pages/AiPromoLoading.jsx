import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPromotion.css";
import Compass from "../image/compass.png";

export default function AiPromoLoading() {
  const nav = useNavigate();
  useEffect(() => {
    const id = setTimeout(() => nav("/organizer/ai-promo/results"), 1500);
    return () => clearTimeout(id);
  }, [nav]);

  return (
    <main className="ai-promo-wrap">
      <h1 className="ai-promo-title" style={{ textAlign: "center" }}>
        AI 홍보 콘텐츠 생성
      </h1>

      <section className="ai-loading">
        <img src={Compass} alt="나침반 로딩" />
        <p className="loading-text">멋진 홍보물 만드는중..</p>
      </section>
    </main>
  );
}
