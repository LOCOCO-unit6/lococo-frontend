// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import "./Header.css";
import Logo from "../image/Logo.png";
import { Link, useNavigate } from "react-router-dom";

// 토큰 키 호환: auth.js(=authToken) 또는 과거 token 키 지원
const getToken = () =>
  localStorage.getItem("authToken") || localStorage.getItem("token");

export default function Header({ mode = "default" }) {
  const isOrganizer = mode === "organizer";
  const nav = useNavigate();

  // 로그인 상태
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  // 탭 간 이동/다른 컴포넌트에서 로그인 상태 변경 시 즉시 반영
  useEffect(() => {
    const sync = () => setLoggedIn(!!getToken());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const navLinks = isOrganizer
    ? [
        { to: "/organizer/ai", label: "AI기획도우미" },
        { to: "/organizer/ai-promo/", label: "AI홍보콘텐츠생성" },
        { to: "/organizer/content/create", label: "콘텐츠등록" },
        { to: "/Service_Guide", label: "서비스안내(이용자용 페이지)" },
        { to: "/organizer/mypage", label: "마이페이지" },
      ]
    : [
        { to: "/AiFestivalRecommend", label: "AI맞춤형축제추천" },
        { to: "/PersonalJourney", label: "개인맞춤여정" },
        { to: "/Service_Guide", label: "서비스안내" },
        { to: "/MyPage/liked-contents", label: "마이페이지" },
      ];

  const handleLogout = () => {
    // 토큰/유저 정보 제거 (양쪽 키 모두 제거해 호환)
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // 상태 즉시 반영
    setLoggedIn(false);
    // 홈 또는 로그인으로 이동 (주최자 헤더면 로그인으로 보내도 됨)
    nav(isOrganizer ? "/login" : "/");
  };

  return (
    <header className="header">
      <Link to={isOrganizer ? "/organizer" : "/"}>
        <div className="header-left">
          <img src={Logo} alt="로고" className="logo" />
        </div>
      </Link>

      <nav className="nav">
        {navLinks.map(({ to, label }) => (
          <Link key={label} to={to}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="header-right">
        {loggedIn ? (
          <button className="login-btn" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <Link to="/login" className="login-btn-link">
            <button className="login-btn">로그인/가입</button>
          </Link>
        )}
      </div>
    </header>
  );
}
