import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchFestivalDetail } from "../utils/festivalService.js";
import "./FestivalDetail.css";

// 🌟 함수: 8자리 날짜 형식을 그대로 반환
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return "미정";
  return dateStr;
};

export default function FestivalDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [festival, setFestival] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [liked, setLiked] = useState(false); // ❤️ 찜 상태

  useEffect(() => {
    if (state && festival?.playtime) {
      setLoading(false);
      return;
    }

    if (!id) return;

    (async () => {
      setLoading(true);
      const data = await fetchFestivalDetail(id);

      if (data && data.title) {
        setFestival((prev) => ({
          ...prev,
          ...data,
        }));
      }
      setLoading(false);
    })();
  }, [id, state, festival?.playtime]);

  if (loading) return <div className="loading">⏳ 정보를 불러오는 중...</div>;

  if (!festival)
    return (
      <div className="festival-detail-container">
        ❌ 축제 정보를 찾을 수 없습니다.
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    );

  // 🌟 렌더링용 필드
  const displayOverview = festival.overview || "소개 정보가 없습니다.";
  const displayStartDate = festival.startDate || festival.eventstartdate;
  const displayEndDate = festival.endDate || festival.eventenddate;
  const displayAddress =
    festival.address || festival.location || "주소 정보 없음";

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="festival-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <div className="festival-detail-image-wrap">
        <img
          src={festival.image || festival.imageUrl || "/image/default.jpg"}
          alt={festival.title}
          className="festival-detail-img"
          onError={(e) => (e.currentTarget.src = "/image/default.jpg")}
        />
      </div>

      <div className="festival-detail-body">
        <h2>{festival.title}</h2>

        <p>
          <strong>📅 기간:</strong> {formatDate(displayStartDate)} ~{" "}
          {formatDate(displayEndDate)}
        </p>
        <p>
          <strong>📍 장소:</strong> {displayAddress}
        </p>

        {festival.tel && (
          <p>
            <strong>📞 문의:</strong> {festival.tel}
          </p>
        )}
        {festival.sponsor && (
          <p>
            <strong>🏛️ 주최:</strong> {festival.sponsor}
          </p>
        )}
        {festival.playtime && (
          <p>
            <strong>⏰ 운영 시간:</strong> {festival.playtime}
          </p>
        )}

        <p className="festival-overview">
          <strong>📖 소개:</strong>
          <br />
          {displayOverview}
        </p>

        {/* ❤️ 소개 박스 우하단 고정 */}
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={handleLikeToggle}
        >
          {liked ? "♥ 찜완료" : "♡ 찜하기"}
        </button>
      </div>
    </div>
  );
}
