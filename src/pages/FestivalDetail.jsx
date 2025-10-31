import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchFestivalDetail } from "../utils/festivalService";
import "./FestivalDetail.css";

export default function FestivalDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [festival, setFestival] = useState(state || null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  // ✅ state가 없으면 API에서 재요청
  useEffect(() => {
    if (festival) return;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchFestivalDetail(id);
        if (!data) throw new Error("데이터 없음");
        setFestival(data);
      } catch (err) {
        console.error(err);
        setError("❌ 축제 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, festival]);

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  if (loading)
    return <div className="festival-detail-container">📡 불러오는 중...</div>;
  if (error) return <div className="festival-detail-container">{error}</div>;

  if (!festival)
    return (
      <div className="festival-detail-container">
        <p>❌ 축제 정보를 찾을 수 없습니다.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 돌아가기
        </button>
      </div>
    );

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
          <strong>📖 소개:</strong>
          <br />
          {festival.overview || "소개 정보가 없습니다."}
        </p>

        {/* ✅ 찜 버튼 토글 only UI */}
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
