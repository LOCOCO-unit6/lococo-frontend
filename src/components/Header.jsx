// src/components/Header.jsx
import React from "react";
import "./Header.css";
import Logo from "../image/Logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ mode = "default" }) {
  const isOrganizer = mode === "organizer";
  const nav = useNavigate();

  const navLinks = isOrganizer
    ? [
        { to: "/organizer", label: "홈" },
        { to: "/organizer/mypage", label: "마이페이지" },
      ]
    : [
        { to: "/AiFestivalRecommend", label: "AI맞춤형축제추천" },
        { to: "#", label: "개인맞춤여정" },
        { to: "#", label: "서비스안내" },
        { to: "/login", label: "마이페이지" },
      ];

  const handleLogout = () => {
    nav("/"); // 임시로 홈으로 보냄
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
        {isOrganizer ? (
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
