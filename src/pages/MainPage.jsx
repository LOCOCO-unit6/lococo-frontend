// src/pages/MainPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "./MainPage.css";

import api from "../api/tourApi.js";
import { fetchFestivals } from "../utils/festivalService.js";

function isArrayOfFestivals(data) {
  return Array.isArray(data) && data.length > 0 && data[0]?.id;
}

function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBannerData = async () => {
      try {
        const year = new Date().getFullYear();
        const data = await fetchFestivals({
          startYmd: `${year}0101`,
          endYmd: `${year}1231`,
          arrange: "C",
          numOfRows: 5,
        });

        isArrayOfFestivals(data) ? setBanners(data) : setBanners([]);
      } catch (err) {
        setError("배너 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadBannerData();
  }, []);

  if (loading) return <div className="banner-loading">📣 배너 로딩중...</div>;

  if (error || banners.length === 0)
    return <div className="banner-error">⚠️ 배너 데이터 없음</div>;

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <Slider {...settings}>
      {banners.map((banner) => (
        <div key={banner.id}>
          <Link to={`/festival/${banner.id}`} state={banner}>
            <div className="banner-slide">
              <img
                src={banner.image || "/image/default.jpg"}
                alt={banner.title}
                className="banner-image"
              />
              <div className="banner-overlay">
                <h2>{banner.title}</h2>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </Slider>
  );
}

function ReviewCarousel() {
  const base = [
    { id: 1, text: "가족 여행 추천 👍" },
    { id: 2, text: "맛집까지 완벽 😍" },
    { id: 3, text: "일정 짜기 편함!" },
  ];
  const items = [...base, ...base];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 6000,
    cssEase: "linear",
    slidesToShow: 3,
    centerMode: true,
    arrows: false,
    draggable: false,
    swipe: false,
  };

  return (
    <div className="review-viewport">
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id}>
            <div className="review-card">
              <p className="stars">★★★★★</p>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default function MainPage() {
  const navigate = useNavigate();
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const year = new Date().getFullYear();
        const data = await fetchFestivals({
          startYmd: `${year}0101`,
          endYmd: `${year}1231`,
          arrange: "B",
          numOfRows: 10,
        });

        const courseData = data.map((f) => ({
          id: f.id,
          title: f.title,
          image: f.image || "/image/default_course.jpg",
          address: f.address || "장소 정보 없음",
          startDate: f.startDate || "",
          endDate: f.endDate || "",
        }));

        setRecommendedCourses(courseData);
      } catch (err) {
        setCoursesError("추천 코스 정보를 불러오지 못했습니다.");
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const renderRecommendedCourses = () => {
    if (coursesLoading)
      return <div className="loading-message">불러오는 중...</div>;
    if (coursesError)
      return <div className="error-message">{coursesError}</div>;
    if (recommendedCourses.length === 0)
      return <div className="error-message">😢 데이터 없음</div>;

    return (
      <div className="recommend-carousel-container">
        <Slider {...sliderSettings}>
          {recommendedCourses.map((course) => (
            <div key={course.id}>
              <Link
                to={`/festival/${course.id}`}
                state={course}
                className="recommend-card-link"
              >
                <div className="recommend-card">
                  <img src={course.image} alt={course.title} />
                  <div className="card-body">
                    <p className="location">{course.address}</p>
                    <p className="title">{course.title}</p>
                    {course.startDate && (
                      <p className="period">
                        {course.startDate} ~ {course.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <main className="main-page">
      <section className="banner-section">
        <BannerCarousel />
      </section>

      <section className="recommend-section">
        <h3>추천 코스</h3>
        {renderRecommendedCourses()}
      </section>

      <section className="ai-section">
        <h3>AI 사용자 맞춤 추천</h3>
        <p>로그인 후 개인 추천 여행지를 받아보세요!</p>
        <button onClick={() => navigate("/login")}>로그인 / 가입</button>
      </section>

      <section className="review-section">
        <h3>로코코 이용 후기</h3>
        <ReviewCarousel />
      </section>
    </main>
  );
}
