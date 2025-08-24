import React from "react";
import { Link } from "react-router-dom";
import "./MyPageSidebar.css";

const MyPageSidebar = ({ activeMenu, onMenuClick, userName }) => {
  return (
    <div className="my-page-sidebar-box">
      <div className="user-info">
        <h3 className="user-name">{userName} 님</h3>
        <Link
          to="/MyPage/Profile"
          className={`user-status-link ${
            activeMenu === "profile-edit" ? "active" : ""
          }`}
          onClick={() => onMenuClick("profile-edit")}
        >
          회원 정보 수정
        </Link>
      </div>

      <ul className="my-page-menu">
        <li
          className={activeMenu === "liked-contents" ? "active" : ""}
          onClick={() => onMenuClick("liked-contents")}
        >
          <Link to="/MyPage/liked-contents">관심 콘텐츠</Link>
        </li>
        <li
          className={activeMenu === "my-journey" ? "active" : ""}
          onClick={() => onMenuClick("my-journey")}
        >
          <Link to="/MyPage_My_Journey_Management">나의 여정 관리</Link>
        </li>
        <li
          className={activeMenu === "reviews" ? "active" : ""}
          onClick={() => onMenuClick("reviews")}
        >
          <Link to="/MyPage/reviews">후기 관리</Link>
        </li>
        <li>
          <Link to="/logout" className="logout-link">
            로그아웃
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MyPageSidebar;
