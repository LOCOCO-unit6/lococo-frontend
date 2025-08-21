import React, { useState } from "react";
import { Link } from "react-router-dom";
import MyPageSidebar from "../components/MyPageSidebar";
import "./MyPage_My_Journey_Management.css";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";

// MyPage_My_Journey_Management 컴포넌트
const MyPage_My_Journey_Management = () => {
  const [activeMenu, setActiveMenu] = useState("my-journey");
  const [activeTab, setActiveTab] = useState("ongoing");

  const [currentDate, setCurrentDate] = useState(new Date("2025-08-11"));
  const [selectedDate, setSelectedDate] = useState(
    new Date("2025-08-11").getDate()
  );

  const [userName, setUserName] = useState("홍길동");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  // 임시 여정 데이터
  const journeyData = [
    {
      id: 1,
      type: "past",
      date: "2025-08-16",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
      description:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟을 소개합니다. 맛집, 카페, 문화 공간 등 다양한 볼거리가 있습니다.",
    },
    {
      id: 2,
      type: "past",
      date: "2025-08-16",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
      description:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟을 소개합니다. 맛집, 카페, 문화 공간 등 다양한 볼거리가 있습니다.",
    },
  ];

  const completedJourneysCount = journeyData.filter(
    (j) => j.type === "past"
  ).length;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDay.getDay();

    return { firstDay, lastDay, startingDay };
  };

  const renderCalendar = () => {
    const { lastDay, startingDay } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= lastDay; i++) {
      const isToday =
        currentDate.getFullYear() === new Date().getFullYear() &&
        currentDate.getMonth() === new Date().getMonth() &&
        i === new Date().getDate();
      const isSelected =
        i === selectedDate &&
        currentDate.getMonth() === new Date("2025-08-11").getMonth();

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isToday ? "today" : ""} ${
            isSelected ? "selected" : ""
          }`}
          onClick={() => setSelectedDate(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="my-page-container">
      <div className="my-page-header">
        <h2>마이페이지</h2>
        <p>사용자 정보 관리 및 각종 기능을 이용하실 수 있습니다.</p>
      </div>

      <div className="my-page-content">
        <MyPageSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          userName={userName}
        />

        <div className="my-page-main-content my-journey-management-content">
          <h3 className="section-title">나의 여정 관리</h3>

          <div className="journey-summary-section">
            <div className="calendar-container">
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                  <FaChevronLeft />
                </button>
                <div className="calendar-month-year">
                  <span>{currentDate.getMonth() + 1}</span>월{" "}
                  <span>{currentDate.getFullYear()}</span>
                </div>
                <button className="calendar-nav-btn" onClick={handleNextMonth}>
                  <FaChevronRight />
                </button>
              </div>
              <div className="calendar-days-of-week">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
              </div>
              <div className="calendar-grid">{renderCalendar()}</div>
            </div>

            <div className="journey-completed-count">
              <p>홍길동님이 완료한 나의 여정은</p>
              <p>
                <span>{completedJourneysCount}</span>개입니다
              </p>
            </div>
          </div>
          <div className="journey-tab-section-with-info">
            <div className="journey-tabs">
              <button
                className={`tab-btn ${activeTab === "ongoing" ? "active" : ""}`}
                onClick={() => setActiveTab("ongoing")}
              >
                진행 예정
              </button>
              <button
                className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
                onClick={() => setActiveTab("past")}
              >
                지난 여정
              </button>
            </div>
            <div className="info-text-wrap">
              <span className="info-text">ⓘ</span> 완료한 나의 여정은 작성한
              후기의 개수로 집계됩니다.
            </div>
          </div>

          <div className="journey-list-container">
            {activeTab === "ongoing" && (
              <p className="no-journey-message">진행 예정인 여정이 없습니다.</p>
            )}

            {activeTab === "past" &&
              journeyData.map((journey) => (
                <div key={journey.id} className="journey-card">
                  <div className="journey-card-header">
                    <span className="journey-date">{journey.date}</span>
                  </div>
                  <div className="journey-buttons-stack">
                    <button className="delete-btn">일정 삭제하기</button>
                    <Link to="/review-write" className="review-btn">
                      후기 작성하기
                    </Link>
                  </div>
                  <div className="journey-card-body-content">
                    <div className="journey-image-placeholder"></div>
                    <div className="journey-details">
                      <p className="journey-location">{journey.location}</p>
                      <h4 className="journey-title">{journey.title}</h4>
                      <p className="journey-description">
                        {journey.description}
                      </p>
                    </div>
                  </div>
                  <Link to="/some-page-to-expand" className="expand-btn">
                    <span>펼치기</span>
                    <FaChevronDown />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage_My_Journey_Management;
