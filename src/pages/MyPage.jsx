// src/pages/MyPage.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import "./MyPage.css";
import { FaHeart } from "react-icons/fa";
import MyPageSidebar from "../components/MyPageSidebar";
import Cookies from "js-cookie"; // Cookies import

// 🚨 API 함수 import (파일 경로에 맞게 수정해주세요)
import { fetchUserInfo, fetchUserFavorites } from "../utils/Api.js";

// 🌟 로그인 상태 확인 함수
const getToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") ||
  Cookies.get("token");

const MyPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [activeMenu, setActiveMenu] = useState("liked-contents");
  const [likedFestivals, setLikedFestivals] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // 🌟 API로 로드할 상태 추가
  const [userName, setUserName] = useState("로딩 중...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken()); // 🌟 로그인 상태 확인

  // 🌟🌟🌟 핵심: 컴포넌트 마운트 시 API 데이터 로드 🌟🌟🌟
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);

    if (!token) {
      setLoading(false);
      return; // 🚨 토큰이 없으면 API 호출 및 로딩 중단
    }

    const loadMypageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 사용자 기본 정보 (UserInfo) 가져오기
        const userInfo = await fetchUserInfo();

        // 2. 찜 목록 (Favorites) 가져오기
        const favorites = await fetchUserFavorites();

        setUserName(userInfo.identification || "사용자");
        setLikedFestivals(favorites || []);
      } catch (e) {
        console.error("마이페이지 로드 실패:", e);
        setUserName("사용자");
        // 403 Forbidden 등 권한 문제 시 메시지 출력
        setError(
          "마이페이지 정보를 불러오는 데 실패했습니다. (권한/토큰 만료 확인 필요)"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMypageData();
  }, []);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const displayFestivals = likedFestivals.slice(
    0,
    showAll ? likedFestivals.length : 3
  );
  const showMoreButtonVisible = likedFestivals.length > 3 && !showAll;

  const handleHeartClick = (e, festivalId) => {
    e.preventDefault();
    e.stopPropagation();

    // 찜 취소는 로그인 상태일 때만 의미 있으므로 바로 클라이언트 측에서 제거
    const filteredItems = likedFestivals.filter(
      (item) => item.id !== festivalId
    );
    setLikedFestivals(filteredItems);
    // TODO: 서버에 찜 취소 요청 로직 추가
  };

  // 🌟🌟🌟 1. 비로그인 시 표시할 UI (가장 먼저 체크) 🌟🌟🌟
  if (!isLoggedIn) {
    return (
      <div
        className="my-page-container unauthorized-state"
        style={{ textAlign: "center", padding: "100px 20px" }}
      >
        <h3 style={{ color: "#dc3545", marginBottom: "15px" }}>
          🚨 로그인 후 이용하실 수 있습니다.
        </h3>
        <p style={{ marginBottom: "30px" }}>
          마이페이지 기능을 이용하려면 먼저 로그인해 주세요.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="login-redirect-btn"
          style={{
            background: "var(--brand)",
            color: "white",
            padding: "10px 30px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  // 2. 로딩/에러 처리 UI
  if (loading) {
    return (
      <div className="my-page-container loading-state">
        📡 마이페이지 정보를 불러오는 중입니다...
      </div>
    );
  }
  if (error) {
    return <div className="my-page-container error-state">⚠️ {error}</div>;
  }

  // 3. 메인 UI
  return (
    <div className="my-page-container">
      <div className="my-page-header">
        <h2>마이페이지</h2>
        <p>사용자 정보 관리 및 각종 기능을 이용하실 수 있습니다.</p>
      </div>

      <div className="my-page-content">
        {/* MyPageSidebar에 API로 가져온 userName 전달 */}
        <MyPageSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          userName={userName}
        />

        {/* 오른쪽 콘텐츠 */}
        <div className="my-page-main-content">
          <h3 className="section-title">관심 콘텐츠</h3>
          {/* ... (찜 목록 렌더링 로직 유지) */}
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

                    <img
                      src={
                        festival.image || festival.img || "/image/default.jpg"
                      }
                      alt={festival.title}
                      className="festival-img"
                    />

                    <div className="card-body">
                      <p className="festival-location">
                        {festival.location || festival.address}
                      </p>
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
