import React, { useState } from "react";
import { Link } from "react-router-dom";
import MyPageSidebar from "../components/MyPageSidebar";
import "./MyPage_Review_Management.css";
import { FaStar } from "react-icons/fa";

const MyPage_Review_Management = () => {
  const [activeMenu, setActiveMenu] = useState("reviews");
  const [userName, setUserName] = useState("홍길동");

  // 후기 데이터를 상태로 관리합니다.
  const [reviewData, setReviewData] = useState([
    {
      id: 1,
      date: "2025-08-07",
      location: "경기도 수원시111111111",
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
      location: "경기도 수원시111111112222222222",
      title: "행궁동 골목여행",
      rating: 5,
      reviewText:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟 축제 추천 즐거웠다재밌었다행복했다가 가가가가 가. 왕추강추 너무재밌었당 또 가고 싶다",
      photos: ["/image/review_photo3.jpg", "/image/review_photo4.jpg"],
    },
  ]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  // 후기 삭제 함수
  const handleDeleteReview = (id) => {
    // 실제로는 백엔드 API를 호출하여 데이터를 삭제해야 합니다.
    // 여기서는 화면에서만 후기를 제거합니다.
    const updatedReviews = reviewData.filter((review) => review.id !== id);
    setReviewData(updatedReviews);
  };

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
                      <button
                        className="review-delete-btn"
                        onClick={() => handleDeleteReview(review.id)} // onClick 이벤트 추가
                      >
                        삭제하기
                      </button>
                      <Link
                        to={`/review-modify/${review.id}`}
                        className="review-edit-btn"
                      >
                        수정하기
                      </Link>
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
