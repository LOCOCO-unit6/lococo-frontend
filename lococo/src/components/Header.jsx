import React from "react";
import "./Header.css";
import Logo from "../image/Logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <div className="header-left">
          <img src={Logo} alt="로고" className="logo" />
        </div>
      </Link>
      <nav className="nav">
        <a href="#">AI맞춤형축제추천</a>
        <a href="#">개인맞춤여정</a>
        <a href="#">서비스안내</a>
        <a href="#">마이페이지</a>
      </nav>
      <div className="header-right">
        <Link to="/signup-choice" className="login-btn-link">
          <button className="login-btn">로그인/가입</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
