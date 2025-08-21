import React, { useState } from "react";
import { Link } from "react-router-dom";
import MyPageSidebar from "../components/MyPageSidebar";
import "./MyPage_Review_Write.css";
import { FaStar, FaTimes } from "react-icons/fa";

const MyPage_Review_Write = () => {
  const [activeMenu, setActiveMenu] = useState("my-journey");
  const [userName, setUserName] = useState("홍길동");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [photos, setPhotos] = useState([]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
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

  const reviewDate = "2025-08-07";
  const reviewLocation = "경기도 수원시";
  const reviewTitle = "행궁동 골목여행";

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
          <h3 className="section-title">후기 작성하기</h3>

          <div className="review-travel-info">
            <div className="review-travel-date">{reviewDate}</div>
            <div className="review-travel-details">
              <div className="review-travel-image-placeholder"></div>
              <div className="review-text-wrap">
                <p className="review-travel-location">{reviewLocation}</p>
                <h4 className="review-travel-title">{reviewTitle}</h4>
                <div className="star-rating">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <FaStar
                        key={index}
                        className={`star ${
                          index <= (hover || rating) ? "active" : ""
                        }`}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="review-detail-section">
            <h4 className="review-field-title">상세 후기</h4>
            <textarea
              className="review-textarea"
              placeholder="상세 후기를 입력해 주세요."
            ></textarea>
          </div>

          <div className="review-photo-section">
            <div className="review-field-title">사진 첨부</div>
            <label htmlFor="photo-upload" className="photo-upload-btn">
              사진 첨부
            </label>
            <input
              type="file"
              id="photo-upload"
              style={{ display: "none" }}
              multiple
              onChange={handlePhotoUpload}
            />
            <div className="photo-preview-container">
              {photos.map((photo, index) => (
                <div key={index} className="photo-preview-wrap">
                  <img
                    src={photo.url}
                    alt={`preview-${index}`}
                    className="photo-preview-img"
                  />
                  <FaTimes
                    className="delete-photo-btn"
                    onClick={() => handleRemovePhoto(photo.url)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="review-summary-section">
            <h4 className="review-field-title">
              추천 한마디 <span className="optional">(선택)</span>
            </h4>
            <textarea
              className="review-summary-textarea"
              placeholder="50자 이내 입력&#10;입력해주신 추천 한마디는 로코코 홈페이지 메인에 게시될 수 있습니다."
            ></textarea>
          </div>

          <div className="review-submit-section">
            <button className="submit-review-btn">작성하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage_Review_Write;
