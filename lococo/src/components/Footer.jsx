import React from "react";
import "./Footer.css";
import Logo from "../image/Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <img src={Logo} alt="로고" className="footer-logo" />
        </div>
        <div className="footer-right">
          <nav className="footer-nav">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
            <span>위치기반서비스 이용약관</span>
            <span>개인위치정보 처리방침</span>
            <span>저작권정책</span>
            <span>자주묻는질문</span>
          </nav>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p className="footer-copyright">LOCOCO@2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
