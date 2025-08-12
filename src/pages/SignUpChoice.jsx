import React from "react";
import "./SignUpChoice.css";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignUpChoice = () => {
  return (
    <div className="signup-choice">
      <h2 className="title">원하는 가입 방식을 선택해 주세요</h2>
      <div className="card-container">
        <Link to="/signup_general" className="card-link">
          <div className="card">
            <FaUser className="card-icon" />
            <h3 className="card-title">일반 가입</h3>
            <p className="card-desc">관광/축제 추천을 원하시나요?</p>
          </div>
        </Link>
        <Link to="/signup" className="card-link">
          <div className="card">
            <FaUserFriends className="card-icon" />
            <h3 className="card-title">기획/주최 가입</h3>
            <p className="card-desc">축제 기획/주최를 원하시나요?</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SignUpChoice;
