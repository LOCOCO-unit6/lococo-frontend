// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../image/Logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("personal"); // personal | company
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 실제 인증 로직 붙이기 (Firebase/백엔드)
    // role 값으로 개인/기업 분기
    console.log({ role, id, pw });

    // 데모: 개인은 메인으로, 기업은 주최자 메인으로 이동
    if (role === "company") navigate("/organizer");
    else navigate("/");
  };

  return (
    <div className="login-page">
      <div className="logo-wrap">
        <img src={Logo} alt="LOCOCO" className="login-logo" />
      </div>

      <h2 className="login-title">로그인</h2>

      {/* ✅ 역할 선택 스위치 */}
      <div className="role-switch" role="tablist" aria-label="로그인 유형 선택">
        <button
          type="button"
          className={`role-tab ${role === "personal" ? "active" : ""}`}
          onClick={() => setRole("personal")}
          role="tab"
          aria-selected={role === "personal"}
        >
          개인회원
        </button>
        <button
          type="button"
          className={`role-tab ${role === "company" ? "active" : ""}`}
          onClick={() => setRole("company")}
          role="tab"
          aria-selected={role === "company"}
        >
          기업회원
        </button>
        <span className={`role-underline ${role}`} />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>

      {/* 회원가입 이동만 유지 */}
      <p
        className="signup-link"
        onClick={() => navigate("/signup-choice")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate("/signup-choice")}
      >
        회원가입 하기
      </p>
    </div>
  );
}
