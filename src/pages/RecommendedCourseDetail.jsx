import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./RecommendedCourseDetail.css";

const RecommendedCourseDetail = () => {
  const { id } = useParams();

  const courseData = {
    id: 1,
    location: "경기도 수원시",
    title: "행궁동 골목여행",
    description:
      "조선시대 국정을 논하던 의정부 터에서, '백성과 함께 즐긴다'는 의미인 여민락의 멋을 오늘에 되살립니다. 일상 속에서 시민 모두가 함께 누리는 국악의 특별한 아름다움을 느낄 수 있습니다. 이제 다시 밝은 의정부 터에서 우리 시대의 여민락을 펼친다. 생동감 넘치는 국악인들의 무대부터 외국인, 장애인, 국악 애호가 등 시민이 함께하는 참여무대, 오감을 깨우는 다채로운 전통 체험과 국악을 배우고 직접 느껴보는 원데이 클래스까지 즐길 수 있다. 전통의 멋과 깊이를 오늘날의 감성으로 풀어내는 2025 서울 국악축제.",
    timeline: [
      { time: "10:30", text: "예술의 전당 한가람 미술관" },
      { time: "10:30", text: "예술의 전당 한가람 미술관" },
      { time: "10:30", text: "예술의 전당 한가람 미술관" },
      { time: "10:30", text: "예술의 전당 한가람 미술관" },
    ],
  };

  return (
    <main className="course-detail-page">
      <div className="course-detail-container">
        <div className="course-info-section">
          <div className="course-image-container">
            <img
              src={courseData.imageUrl}
              alt={courseData.title}
              className="course-image"
            />
          </div>
          <div className="course-text-content">
            <p className="course-location">{courseData.location}</p>
            <h1 className="course-title">{courseData.title}</h1>
            <div className="course-description-box">
              <h2 className="course-section-title">소개</h2>
              <p className="course-description">{courseData.description}</p>
            </div>
          </div>
        </div>

        <div className="course-main-content-section">
          <div className="course-timeline-section">
            {courseData.timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <span className="timeline-dot" />
                <span className="timeline-time">{item.time}</span>
                <span className="timeline-text">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="ai-recommend-section">
            <p className="ai-recommend-text">
              더욱 다양한 AI 맞춤 추천을 받아보고 싶으신가요?
            </p>
            <h4 className="ai-recommend-title">
              <span className="text-primary-color">로그인</span>
              <span className="text-secondary-color"> 후 로코코를 </span>
              <span className="text-primary-color">100%</span>
              <span className="text-secondary-color"> 누려보세요!</span>
            </h4>
            <div className="ai-recommend-buttons">
              <Link to="/Service_Guide">
                <button className="ai-btn-primary">로코코가 궁금하다면?</button>
              </Link>
              <Link to="/login">
                <button className="ai-btn-secondary">로그인/가입</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RecommendedCourseDetail;
