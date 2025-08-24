import React, { useState } from "react";
import MyPageSidebar from "../components/MyPageSidebar";
import "./Review_Modify.css";
import { FaStar, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";

const Review_Modify = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(4);
  const [hover, setHover] = useState(4);
  const [reviewText, setReviewText] = useState(
    "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟 축제 추천 즐거웠다재밌었다행복했다가 가가가가 가. 왕추강추 너무재밌었당 또 가고 싶다"
  );
  const [recommendation, setRecommendation] = useState(
    "로코코에서 추천받은 여정으로 가족 여행을 다녀왔어요 강추입니다"
  );
  const [photos, setPhotos] = useState([
    {
      url: "/image/review_photo1.jpg",
      file: null,
    },
    {
      url: "/image/review_photo2.jpg",
      file: null,
    },
    {
      url: "/image/review_photo3.jpg",
      file: null,
    },
  ]);

  const handleRatingClick = (newRating) => {
    setRating(newRating);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleRemovePhoto = (photoToRemoveUrl) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.url !== photoToRemoveUrl)
    );
    URL.revokeObjectURL(photoToRemoveUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("후기 수정 완료", {
      reviewId: id,
      rating,
      reviewText,
      recommendation,
      photos,
    });
  };

  return (
    <div className="review-modify-container">
      <div className="my-page-content">
        <MyPageSidebar activeMenu="reviews" />
        <div className="review-modify-main-content">
          <h3 className="review-modify-title">후기 수정하기</h3>
          <div className="review-modify-card">
            <div className="review-modify-info-section">
              <div className="review-modify-date">2025-08-07</div>
              <div className="review-modify-details">
                <p className="review-modify-location">경기도 수원시</p>
                <h4 className="review-modify-title-text">행궁동 골목여행</h4>
                <div className="review-modify-star-rating">
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        className={`star-icon ${
                          ratingValue <= (hover || rating) ? "active" : ""
                        }`}
                        onClick={() => handleRatingClick(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(rating)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="review-modify-form-section">
              <h4 className="form-field-title">상세 후기</h4>
              <textarea
                className="review-modify-textarea"
                placeholder="상세 후기를 입력해 주세요."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>
            <div className="review-modify-form-section">
              <h4 className="form-field-title">사진 첨부</h4>
              <p className="photo-info-text">
                사진 분석을 바탕으로 AI가 맞춤 추천을 해드립니다
              </p>
              <div className="photo-upload-container">
                <label
                  htmlFor="photo-upload-input"
                  className="photo-upload-btn"
                >
                  사진 첨부
                </label>
                <input
                  type="file"
                  id="photo-upload-input"
                  multiple
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
              </div>
              <div className="photo-preview-container">
                {photos.map((photo, index) => (
                  <div key={index} className="photo-preview-wrap">
                    <img
                      src={photo.url}
                      alt={`preview-${index}`}
                      className="photo-preview-img"
                    />
                    <button
                      className="remove-photo-btn"
                      onClick={() => handleRemovePhoto(photo.url)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="review-modify-form-section">
              <h4 className="form-field-title">추천 한마디 (선택)</h4>
              <textarea
                className="review-modify-summary-textarea"
                placeholder="50자 이내 입력&#10;입력해주신 추천 한마디는 로코코 홈페이지 메인에 게시될 수 있습니다."
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              ></textarea>
            </div>
            <div className="review-modify-submit-section">
              <button
                className="review-modify-submit-btn"
                onClick={handleSubmit}
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review_Modify;
