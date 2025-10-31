import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchFestivalDetail } from "../utils/festivalService";
import "./FestivalDetail.css";

export default function FestivalDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [festival, setFestival] = useState(state || null);
  const [loading, setLoading] = useState(!state);

  useEffect(() => {
    if (!state) {
      (async () => {
        setLoading(true);
        const data = await fetchFestivalDetail(id);
        setFestival(data);
        setLoading(false);
      })();
    }
  }, [id, state]);

  if (loading) return <div className="loading">⏳ 정보를 불러오는 중...</div>;

  if (!festival)
    return (
      <div>
        ❌ 축제 정보를 찾을 수 없습니다.
        <button onClick={() => navigate(-1)}>뒤로가기</button>
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
          <strong>📍 장소:</strong> {festival.address}
        </p>

        <p>
          <strong>📖 소개:</strong>
          <br />
          {festival.overview || "😥 소개 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
}
