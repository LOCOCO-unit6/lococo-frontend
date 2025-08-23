import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./PersonalJourney_Result.css";

const PersonalJourneyResult = () => {
  const [expandedCards, setExpandedCards] = useState({});

  const journeyData = [
    {
      id: 1,
      date: "2025-08-07",
      location: "서울특별시 강남구",
      title: "강남 가족 투어",
      description:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟 축제 추천 아아아아아아아아아아아아aklakjqkdkjdlfjdlfklgnldfjgdfdhfsobhdflsknbdlfknalkfjoijawgrjlfgjlfgakdfljdgk",
      imageUrl: "/image/journey1.png",
      timeline: [
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
      ],
    },
    {
      id: 2,
      date: "2025-08-07",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
      description:
        "가족과 함께 즐기기 좋은 수원시 행궁동의 골목 여행 스팟 축제 추천 아아아아아아아아아아아아aklakjqkdkjdlfjdlfklgnldfjgdfdhfsobhdflsknbdlfknalkfjoijawgrjlfgjlfgakdfljdgk",
      imageUrl: "/image/journey2.png",
      timeline: [
        { time: "10:30", text: "수원화성 방화수류정" },
        { time: "12:00", text: "행리단길 맛집 탐방" },
        { time: "14:30", text: "행궁동 벽화마을 산책" },
      ],
    },
  ];

  const handleToggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="pj-result-container">
      <div className="pj-result-header">
        <h2 className="pj-result-title">개인 맞춤 여정</h2>
        <Link to="/survey" className="pj-survey-btn">
          설문조사 다시하기
        </Link>
      </div>

      <div className="pj-card-list">
        {journeyData.map((journey) => (
          <div key={journey.id} className="pj-result-card">
            <div className="pj-card-top">
              <div className="pj-card-content-wrap">
                <span className="pj-date">{journey.date}</span>
                <div className="pj-card-body">
                  <div className="pj-image-wrap">
                    <img
                      src={journey.imageUrl}
                      alt={journey.title}
                      className="pj-image"
                    />
                  </div>
                  <div className="pj-details-text">
                    <p className="pj-location">{journey.location}</p>
                    <h4 className="pj-title">{journey.title}</h4>
                    <p className="pj-description">{journey.description}</p>
                  </div>
                </div>
              </div>
              <div className="pj-card-buttons">
                <button className="pj-btn-dislike">관심없음</button>
                <button className="pj-btn-add">나의 여정 추가하기</button>
              </div>
            </div>

            {expandedCards[journey.id] && (
              <div className="pj-timeline-section">
                {journey.timeline.map((item, index) => (
                  <div key={index} className="pj-timeline-item">
                    <span className="pj-timeline-dot" />
                    <span className="pj-timeline-text">
                      <span className="pj-timeline-time">{item.time}</span>{" "}
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              className="pj-expand-btn"
              onClick={() => handleToggleExpand(journey.id)}
            >
              {expandedCards[journey.id] ? (
                <>
                  접기 <FaChevronUp />
                </>
              ) : (
                <>
                  펼치기 <FaChevronDown />
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalJourneyResult;
