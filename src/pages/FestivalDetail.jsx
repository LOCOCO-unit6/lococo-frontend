// src/pages/FestivalDetail.jsx

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

  useEffect(() => {
    // 이미 목록 데이터가 있고, 필요한 정보가 있다면 API 호출을 건너뜁니다.
    if (state && festival?.playtime) {
      setLoading(false);
      return;
    }

    if (!id) return;

    (async () => {
      setLoading(true);
      const data = await fetchFestivalDetail(id);

      if (data && data.title) {
        // API 상세 데이터로 기존 상태를 덮어씁니다.
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

  // 🌟 렌더링에 사용할 필드 정리 및 매핑
  const displayOverview = festival.overview || "소개 정보가 없습니다.";
  const displayStartDate = festival.startDate || festival.eventstartdate;
  const displayEndDate = festival.endDate || festival.eventenddate;
  const displayAddress =
    festival.address || festival.location || "주소 정보 없음";

  return (
    <div className="festival-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <img
        src={festival.image || festival.imageUrl || "/image/default.jpg"}
        alt={festival.title}
        className="festival-detail-img"
        onError={(e) => (e.currentTarget.src = "/image/default.jpg")}
      />

      <div className="festival-detail-body">
        <h2>{festival.title}</h2>

        <p>
          <strong>📅 기간:</strong> {formatDate(displayStartDate)} ~{" "}
          {formatDate(displayEndDate)}
        </p>
        <p>
          <strong>📍 장소:</strong> {displayAddress}
        </p>

        {/* 🌟🌟🌟 추가 정보: 연락처, 운영 시간, 주최 정보 표시 🌟🌟🌟 */}
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

        {/* 소개 정보 (가장 마지막에 표시) */}
        <p>
          <strong>📖 소개:</strong>
          <br />
          {displayOverview}
        </p>
      </div>
    </div>
  );
}
