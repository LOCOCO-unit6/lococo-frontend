import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../image/Logo2.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
