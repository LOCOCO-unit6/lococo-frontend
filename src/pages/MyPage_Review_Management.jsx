import React, { useState } from "react";
import { Link } from "react-router-dom";
import MyPageSidebar from "../components/MyPageSidebar";
import "./MyPage_Review_Management.css";
import { FaStar } from "react-icons/fa";

const MyPage_Review_Management = () => {
  const [activeMenu, setActiveMenu] = useState("reviews");
  const [userName, setUserName] = useState("홍길동");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const reviewData = [
    {
      id: 1,
      date: "2025-08-07",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
      rating: 4,
      reviewText:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟 축제 추천 즐거웠다재밌었다행복했다가 가가가가 가. 왕추강추 너무재밌었당 또 가고 싶다",
      photos: [
        "/image/review_photo1.jpg",
        "/image/review_photo2.jpg",
        "/image/review_photo3.jpg",
      ],
    },
    {
      id: 2,
      date: "2025-08-07",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
      rating: 5,
      reviewText:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟 축제 추천 즐거웠다재밌었다행복했다가 가가가가 가. 왕추강추 너무재밌었당 또 가고 싶다",
      photos: ["/image/review_photo3.jpg", "/image/review_photo4.jpg"],
    },
  ];

  return (
    <div className="my-page-container">
      <div className="my-page-header">
        <h2>마이페이지</h2>
        <p>사용자 정보 관리 및 각종 기능을 이용하실 수 있습니다.</p>
      </div>

      <div className="my-page-content">
        <MyPageSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          userName={userName}
        />

        <div className="my-page-main-content">
          <h3 className="review-page-title">후기 관리</h3>

          <div className="review-list-container">
            {reviewData.map((review) => (
              <div key={review.id} className="review-card-wrapper">
                <div className="review-card-info-section">
                  <div className="review-card-header">
                    <div className="review-header-info">
                      {/* 날짜와 그 아래 내용을 하나의 div로 묶어 간격을 조절합니다. */}
                      <div className="review-date">{review.date}</div>
                      <p className="review-location">{review.location}</p>
                      <h4 className="review-title">{review.title}</h4>
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
                    </div>
                    <div className="review-buttons-stack">
                      <button className="review-delete-btn">삭제하기</button>
                      <button className="review-edit-btn">수정하기</button>
                    </div>
                  </div>
                </div>
                <div className="review-card-content-section">
                  <p className="review-text">{review.reviewText}</p>
                  <div className="review-photos-container">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review photo ${index}`}
                        className="review-photo"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage_Review_Management;
