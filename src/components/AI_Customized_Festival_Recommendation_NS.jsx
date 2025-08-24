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
        <p className="login-required-text">
          설문조사에 참여하고 맞춤 추천을 받아보세요
        </p>
        <Link to="/survey" className="login-signup-btn">
          설문조사 하러 가기
        </Link>
      </div>
    </div>
  );
};

export default AICustomizedFestivalRecommendationNL;
