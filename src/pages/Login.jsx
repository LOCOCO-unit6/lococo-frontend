// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../image/Logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 일반 로그인 로직
  };

  return (
    <div className="login-page">
      <div className="logo-wrap">
        <img src={Logo} alt="LOCOCO" className="login-logo" />
      </div>

      <h2 className="login-title">로그인</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="아이디" required />
        <input type="password" placeholder="비밀번호" required />
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>

      {/* 회원가입 링크 */}
      <p
        className="signup-link"
        onClick={() => navigate("/signup-choice")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate("/signup-choice")}
      >
        회원가입 하기
      </p>

      {/* 주최자용 로그인 버튼 추가 */}
      <button
        type="button"
        className="login-btn"
        style={{ marginTop: "12px", background: "#444" }}
        onClick={() => navigate("/organizer")}
      >
        주최자용 로그인
      </button>
    </div>
  );
}
