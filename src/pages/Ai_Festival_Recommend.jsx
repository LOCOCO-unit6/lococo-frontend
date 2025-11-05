import React, { useEffect, useState } from "react";
import { fetchFestivals } from "../utils/festivalService";
import { useNavigate } from "react-router-dom";
import "./Ai_Festival_Recommend.css";

export default function AiFestivalRecommend() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const year = new Date().getFullYear();
    const startYmd = `${year}0101`;
    const endYmd = `${year}1231`;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchFestivals({
          startYmd,
          endYmd,
          arrange: "C",
          numOfRows: 50,
        });
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="recommend-page-container">📡 불러오는 중…</div>;
  if (error)
    return <div className="recommend-page-container">⚠️ 오류 발생</div>;
  if (!items.length)
    return <div className="recommend-page-container">😢 축제 없음</div>;

  return (
    <div className="recommend-page-container">
      <div className="recommend-header-wrap">
        <h2 className="page-title">AI 맞춤형 축제 추천</h2>

        {/* 🌟 설문조사 다시 하기 버튼 🌟 */}
        <button className="survey-restart-btn" onClick={() => nav("/survey")}>
          설문조사 하러 가기
        </button>
      </div>

      <div className="festival-grid">
        {items.map((f) => (
          <div
            key={f.id}
            className="festival-card"
            onClick={() => nav(`/festival/${f.id}`, { state: f })} // ✅ state로 데이터 전달
          >
            <img
              src={f.image || "/image/default.jpg"}
              alt={f.title}
              className="festival-img"
              onError={(e) => (e.currentTarget.src = "/image/default.jpg")}
            />
            <div className="card-body">
              <h3>{f.title}</h3>
              <p>{f.address || "주소 정보 없음"}</p>
              <p>
                {f.startDate} ~ {f.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
