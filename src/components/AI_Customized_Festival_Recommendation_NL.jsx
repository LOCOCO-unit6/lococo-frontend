import React from "react";
import { Link } from "react-router-dom";
import Logo3 from "../image/Logo3.png";
import "./AI_Customized_Festival_Recommendation_NL.css";

const AICustomizedFestivalRecommendationNL = () => {
  return (
    <div className="recommend-page-container">
      <h2 className="recommend-page-title">AI 맞춤형 축제 추천</h2>
      <div className="recommend-message-box">
        <img src={Logo3} alt="Lococo Logo" className="logo-icon" />
        <p className="login-required-text">로그인이 필요합니다</p>
        <Link to="/login" className="login-signup-btn">
          로그인/가입
        </Link>
      </div>
    </div>
  );
};

export default AICustomizedFestivalRecommendationNL;
