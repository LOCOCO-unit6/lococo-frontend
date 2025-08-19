// src/pages/Ai_Festival_Recommend.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Ai_Festival_Recommend.css";
import { FaHeart } from "react-icons/fa";

const AiFestivalRecommend = () => {
  const [festivalData, setFestivalData] = useState([
    {
      id: 1,
      img: "/image/Seoul.png",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.08.15",
      isLiked: false,
    },
    {
      id: 2,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.08.15",
      isLiked: false,
    },
    {
      id: 3,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.08.15",
      isLiked: false,
    },
    {
      id: 4,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.04.16",
      isLiked: false,
    },
    {
      id: 5,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.08.15",
      isLiked: false,
    },
    {
      id: 6,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.12 - 2025.08.15",
      isLiked: false,
    },
    {
      id: 7,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.08.15",
      isLiked: false,
    },
    {
      id: 8,
      img: "/image/seoul_gugak.jpg",
      title: "서울국악축제",
      location: "서울시 종로구",
      date: "2025.08.13 - 2025.04.16",
      isLiked: false,
    },
  ]);

  const handleHeartClick = (e, festivalId) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation(); // 부모 요소(Link)로 이벤트 전파 방지

    const updatedData = festivalData.map((festival) =>
      festival.id === festivalId
        ? { ...festival, isLiked: !festival.isLiked }
        : festival
    );
    setFestivalData(updatedData);

    // 여기에서 백엔드 API를 호출하여 데이터 전송 로직을 추가할 수 있습니다.
    // 예를 들어:
    // const isLiking = updatedData.find(f => f.id === festivalId).isLiked;
    // if (isLiking) {
    //     console.log(`${festivalId}번 축제 좋아요!`);
    //     // axios.post('/api/like', { festivalId: festivalId });
    // } else {
    //     console.log(`${festivalId}번 축제 좋아요 취소!`);
    //     // axios.delete('/api/like', { festivalId: festivalId });
    // }
  };

  return (
    <div className="recommend-page-container">
      <div className="recommend-header">
        <h2>AI 맞춤형 축제 추천</h2>
        <Link to="/survey" className="retake-survey-btn">
          설문조사 다시하기
        </Link>
      </div>

      <div className="festival-grid">
        {festivalData.map((festival) => (
          <Link
            to={`/festival/${festival.id}`}
            key={festival.id}
            className="festival-link"
          >
            <div className="festival-card">
              <div
                className="heart-button-wrap"
                onClick={(e) => handleHeartClick(e, festival.id)}
              >
                <FaHeart
                  className={`heart-icon ${festival.isLiked ? "liked" : ""}`}
                />
              </div>
              <img
                src={festival.img}
                alt={festival.title}
                className="festival-img"
              />
              <div className="card-body">
                <p className="festival-location">{festival.location}</p>
                <h3 className="festival-title">{festival.title}</h3>
                <p className="festival-date">{festival.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AiFestivalRecommend;
