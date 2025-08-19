// src/pages/FestivalDetail.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./FestivalDetail.css";

const FestivalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // 실제로는 API를 호출하여 ID에 맞는 데이터를 가져와야 합니다.
  const festival = {
    id: "1",
    title: "서울 국악 축제",
    location: "서울특별시 종로구",
    date: "2025.08.13 ~ 2025.08.15",
    fee: "무료",
    poster: "/image/Seoul.jpg",
    description:
      "조선시대 국악당을 논하던 낙원과 운당여관에서, 오성과 한음 등 수많은 인재들이 기생들과 함께 풍류를 즐기던 곳, 바로 서울 한복판에 자리한 낙원동입니다. 낙원동이라는 이름에 걸맞게 다양한 장르의 국악이 풍성하게 어우러지는 2025 서울국악축제에 여러분을 초대합니다. ",
  };

  // 마운트 시 (첫 렌더링 시) 좋아요 상태를 불러오는 로직 (백엔드 연동 시)
  useEffect(() => {
    // 백엔드에서 해당 축제의 좋아요 상태를 확인하여 setIsLiked를 설정
    // 예를 들어, fetch(`/api/check-like/${id}`)
  }, [id]);

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    // 여기에서 백엔드 API를 호출하여 좋아요 상태를 전송하는 로직을 추가할 수 있습니다.
    console.log(`축제 ID ${id}의 좋아요 상태: ${!isLiked}`);
  };

  const handleBackClick = () => {
    navigate("/AiFestivalRecommend");
  };

  return (
    <div className="detail-container">
      <div className="detail-main-content">
        <div className="poster-section">
          <img
            src={festival.poster}
            alt={festival.title}
            className="festival-poster"
          />
        </div>
        <div className="info-section">
          <div className="detail-header">
            <h1>{festival.title}</h1>
            <span onClick={handleHeartClick}>
              <FaHeart
                className={`detail-heart-icon ${isLiked ? "liked" : ""}`}
              />
            </span>
          </div>
          <p className="detail-location">{festival.location}</p>
          <p className="detail-date">{festival.date}</p>

          <div className="detail-divider"></div>

          <p className="detail-fee">
            요금 <span className="fee-amount">{festival.fee}</span>
          </p>

          <div className="detail-intro-section">
            <p>
              <span className="intro-label">소개</span> {festival.description}
            </p>
          </div>
        </div>
      </div>

      <div className="review-section-wrap">
        <h2>이용자 후기</h2>
        {/* 리뷰 목록은 여기에 동적으로 렌더링 */}
        <div className="review-list">
          {/* 예시 리뷰 카드 */}
          <div className="review-card-detail">
            <div className="review-meta">
              <p className="review-rating">★★★★★</p>
              <p className="review-date-detail">2023/10/14</p>
            </div>
            <p className="review-author">홍*님</p>
            <p className="review-text">
              로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다
            </p>
          </div>
          {/* ... 다른 리뷰들 */}
        </div>
        <div className="pagination">
          <button>&lt;</button>
          <span>1 2 3 4 5 6 7 8</span>
          <button>&gt;</button>
        </div>
      </div>

      <div className="back-button-wrap">
        <button className="back-to-list-btn" onClick={handleBackClick}>
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default FestivalDetail;
