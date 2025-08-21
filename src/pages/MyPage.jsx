import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MyPage.css";
import { FaHeart } from "react-icons/fa";
import MyPageSidebar from "../components/MyPageSidebar"; // MyPageSidebar 컴포넌트를 import합니다.

const MyPage = () => {
  const [activeMenu, setActiveMenu] = useState("liked-contents");
  const [likedFestivals, setLikedFestivals] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [userName, setUserName] = useState("홍길동");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const displayFestivals = likedFestivals;

  const showMoreButtonVisible = displayFestivals.length > 3 && !showAll;

  const handleHeartClick = (e, festivalId) => {
    e.preventDefault();
    e.stopPropagation();

    const filteredItems = likedFestivals.filter(
      (item) => item.id !== festivalId
    );
    setLikedFestivals(filteredItems);
  };

  return (
    <div className="my-page-container">
      <div className="my-page-header">
        <h2>마이페이지</h2>
        <p>사용자 정보 관리 및 각종 기능을 이용하실 수 있습니다.</p>
      </div>

      <div className="my-page-content">
        {/* 기존 사이드바 코드를 MyPageSidebar 컴포넌트로 대체 */}
        <MyPageSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          userName={userName}
        />

        {/* 오른쪽 콘텐츠 */}
        <div className="my-page-main-content">
          <h3 className="section-title">관심 콘텐츠</h3>
          {displayFestivals.length === 0 ? (
            <p className="no-content">관심 콘텐츠가 없습니다.</p>
          ) : (
            <div className="festival-grid">
              {displayFestivals.map((festival) => (
                <div key={festival.id} className="festival-card">
                  <Link
                    to={`/festival/${festival.id}`}
                    className="festival-link"
                  >
                    <div
                      className="heart-button-wrap"
                      onClick={(e) => handleHeartClick(e, festival.id)}
                    >
                      <FaHeart className="heart-icon liked" />
                    </div>
                    {/* 이미지 경로가 없는 경우를 고려하여 img 태그를 수정합니다. */}
                    {festival.img && (
                      <img
                        src={festival.img}
                        alt={festival.title}
                        className="festival-img"
                      />
                    )}

                    <div className="card-body">
                      <p className="festival-location">{festival.location}</p>
                      <h3 className="festival-title">{festival.title}</h3>
                      <p className="festival-date">{festival.date}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          {showMoreButtonVisible && (
            <div className="more-btn-container">
              <button
                onClick={() => setShowAll(true)}
                className="show-more-btn"
              >
                더 살펴보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
