// src/pages/FestivalDetail.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./FestivalDetail.css";

const FestivalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

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

  const reviewData = [
    {
      id: 1,
      user: "홍*님",
      rating: 5,
      date: "2025/08/18",
      text: "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다",
      photos: [
        "/image/review1.png",
        "/image/review2.png",
        "/image/review3.png",
      ],
    },
    {
      id: 2,
      user: "홍*님",
      rating: 4,
      date: "2025/08/18",
      text: "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다",
      photos: [],
    },
    {
      id: 3,
      user: "홍*님",
      rating: 5,
      date: "2025/08/18",
      text: "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다",
      photos: [],
    },
    {
      id: 4,
      user: "홍*님",
      rating: 4,
      date: "2025/08/18",
      text: "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다",
      photos: ["/image/review3.png"],
    },
    {
      id: 5,
      user: "홍*님",
      rating: 5,
      date: "2025/08/18",
      text: "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다",
      photos: [],
    },
    {
      id: 6,
      user: "홍*님",
      rating: 5,
      date: "2025/08/18",
      text: "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다",
      photos: ["/image/review4.png"],
    },
  ];

  useEffect(() => {
    // 백엔드에서 해당 축제의 좋아요 상태를 확인하여 setIsLiked를 설정
  }, [id]);

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    console.log(`축제 ID ${id}의 좋아요 상태: ${!isLiked}`);
  };

  const handleBackClick = () => {
    navigate("/AiFestivalRecommend");
  };

  const totalPages = Math.ceil(reviewData.length / reviewsPerPage);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="festival-detail-container">
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
        <h2 className="review-section-title">
          이용자 후기 ({reviewData.length})
        </h2>
        <div className="reviews-list">
          {currentReviews.map((review) => (
            <div key={review.id} className="review-item-card">
              <p className="review-date-top">{review.date}</p>

              {/* 이미지 존재 여부에 따라 조건부 렌더링 */}
              {review.photos && review.photos.length > 0 && (
                <div className="review-photos-container">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`review photo ${index}`}
                      className="review-photo-thumbnail"
                    />
                  ))}
                </div>
              )}

              <div className="review-meta-data">
                <div className="review-star-rating">
                  {[...Array(5)].map((star, index) => (
                    <FaStar
                      key={index}
                      className={`star ${
                        index < review.rating ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="reviewer-name">{review.user}</p>
                <p className="review-text">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination-controls">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagination-arrow-btn"
          >
            <FaChevronLeft />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`pagination-number-btn ${
                currentPage === number ? "active" : ""
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-arrow-btn"
          >
            <FaChevronRight />
          </button>
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
