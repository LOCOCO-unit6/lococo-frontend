import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FestivalDetail.css";

export default function FestivalDetail() {
  const { state: festival } = useLocation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false); // ✅ 단순 UI 상태만 관리

  if (!festival)
    return (
      <div className="festival-detail-container">
        <p>❌ 축제 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    );

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="festival-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <img
        src={festival.image || "/image/default.jpg"}
        alt={festival.title}
        className="festival-detail-img"
        onError={(e) => (e.currentTarget.src = "/image/default.jpg")}
      />

      <div className="festival-detail-body">
        <h2>{festival.title}</h2>
        <p>
          <strong>📅 기간:</strong> {festival.startDate} ~ {festival.endDate}
        </p>
        <p>
          <strong>📍 장소:</strong> {festival.address || "주소 정보 없음"}
        </p>
        <p>
          <strong>📖 소개:</strong>{" "}
          {festival.overview || "소개 정보가 없습니다."}
        </p>

        {/* ✅ 찜 버튼 (UI만 토글) */}
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={toggleLike}
        >
          {liked ? "❤️ 찜 완료" : "🤍 찜하기"}
        </button>
      </div>
    </div>
  );
}
