// src/pages/MainPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "./MainPage.css";

// API 함수 및 인스턴스 import
import api from "../api/tourApi.js";
import { fetchFestivals } from "../utils/festivalService.js";

// 여행 코스 콘텐츠 타입 ID
const CONTENT_TYPE_ID_COURSE = 25;

// 🌟🌟🌟 오류 해결: 누락된 함수 정의 추가 🌟🌟🌟
// 데이터가 배열이고 유효한 축제/코스 데이터인지 확인합니다.
function isArrayOfFestivals(data) {
  return (
    Array.isArray(data) && data.length > 0 && typeof data[0]?.id !== "undefined"
  );
}

// 🌟 fetchRecommendedJourneys 함수를 MainPage.jsx 파일 내부에 정의
const fetchRecommendedJourneys = async (filters) => {
  const { city, district, keywords } = filters;

  let keyword = "";
  const region = district || city || "";

  if (keywords.length > 0) {
    keyword = `${region} ${keywords[0]}`.trim();
  } else {
    keyword = region || "여행 코스";
  }

  const apiParams = {
    keyword: keyword,
    contentTypeId: CONTENT_TYPE_ID_COURSE,
    listYN: "Y",
    arrange: "A",
    numOfRows: 20,
    pageNo: 1,
  };

  try {
    const { data } = await api.get("searchKeyword2", { params: apiParams });

    const tourData = data?.response?.body?.items?.item ?? [];
    const items = Array.isArray(tourData) ? tourData : [tourData];

    return items.map((i) => ({
      id: String(i.contentid ?? ""),
      date: "기간 정보 미정",
      location: i.addr1 ?? i.addr2 ?? "",
      title: i.title ?? "",
      description: "TourAPI에서 검색된 여행 코스 정보입니다.",
      imageUrl: i.firstimage || i.firstimage2 || "/image/default_course.jpg",
      timeline: [],
    }));
  } catch (error) {
    console.error("❌ fetchRecommendedJourneys 실패:", error);
    throw new Error("여정 정보를 불러오는 데 실패했습니다.");
  }
};

function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBannerData = async () => {
      try {
        setLoading(true);
        const year = new Date().getFullYear();

        const data = await fetchFestivals({
          startYmd: `${year}0101`,
          endYmd: `${year}1231`,
          arrange: "C",
          numOfRows: 5,
        });

        if (isArrayOfFestivals(data)) {
          // 🌟 isArrayOfFestivals 사용
          setBanners(data);
        } else {
          setBanners([]);
        }
      } catch (e) {
        console.error("배너 데이터 로드 실패:", e);
        setError("배너 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadBannerData();
  }, []);

  if (loading) {
    return (
      <div className="banner-loading">📣 최신 축제 정보를 불러오는 중...</div>
    );
  }
  if (error || banners.length === 0) {
    return (
      <div className="banner-error">
        ⚠️ {error || "표시할 축제 정보가 없습니다."}
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <Slider {...settings}>
      {banners.map((banner) => (
        <div key={banner.id}>
          <Link to={`/festival/${banner.id}`}>
            <div className="banner-slide">
              <img
                src={banner.image || "/image/default.jpg"}
                alt={banner.title}
                className="banner-image"
                onError={(e) => (e.currentTarget.src = "/image/default.jpg")}
              />
              <div className="banner-overlay">
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
                  {banner.title}
                </h2>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </Slider>
  );
}

function ReviewCarousel() {
  // ... (기존 ReviewCarousel 로직 유지)
  const base = [
    { id: 1, text: "로코코 추천으로 가족 여행 다녀왔어요! 강추 👍" },
    { id: 2, text: "포토존 코스가 딱 제 취향이었어요 😍" },
    { id: 3, text: "현지 맛집까지 일정에 포함돼서 편했어요." },
    { id: 4, text: "축제 동선 깔끔, 혼잡도 정보 도움됐습니다." },
    { id: 5, text: "부모님 모시고 힐링 코스 성공 ✨" },
  ];
  const items = [...base, ...base, ...base];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 6000,
    cssEase: "linear",
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "80px",
    arrows: false,
    dots: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    draggable: false,
    swipe: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: "56px" },
      },
      { breakpoint: 640, settings: { slidesToShow: 1, centerPadding: "24px" } },
    ],
  };

  return (
    <div className="review-viewport">
      <Slider {...settings}>
        {items.map((it, idx) => (
          <div key={`${it.id}-${idx}`}>
            <div className="review-card">
              <p className="stars">★★★★★</p>
              <p>{it.text}</p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="review-center-guide" aria-hidden />
    </div>
  );
}

export default function MainPage() {
  const navigate = useNavigate();

  // 추천 코스 데이터 상태 관리
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  // 추천 코스 데이터 로드 useEffect
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);

        // API 호출: 추천 코스용 축제 5개 요청 (배너와 겹치지 않게 pageNo=2로 요청)
        const year = new Date().getFullYear();
        const data = await fetchFestivals({
          startYmd: `${year}0101`,
          endYmd: `${year}1231`,
          arrange: "B",
          numOfRows: 5,
          pageNo: 2, // 🌟 다음 페이지 데이터 요청
        });

        if (isArrayOfFestivals(data)) {
          // 🌟 isArrayOfFestivals 사용
          // 축제 데이터를 코스 데이터로 형식 변환하여 저장
          const courseData = data.map((f) => ({
            id: f.id,
            img: f.image || "/image/default_course.jpg",
            location: f.address || f.title,
            title: f.title,
          }));
          setRecommendedCourses(courseData);
        } else {
          setRecommendedCourses([]);
        }
      } catch (e) {
        console.error("추천 코스 데이터 로드 실패:", e);
        setCoursesError("추천 코스 정보를 불러오는 데 실패했습니다.");
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourseData();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // 추천 코스 렌더링 함수
  const renderRecommendedCourses = () => {
    if (coursesLoading) {
      return <div className="loading-message">코스 정보를 불러오는 중...</div>;
    }
    if (coursesError) {
      return <div className="error-message">⚠️ {coursesError}</div>;
    }
    if (recommendedCourses.length === 0) {
      // 데이터가 없을 경우에도 깔끔한 메시지 표시
      return (
        <div className="error-message">😢 표시할 코스 정보가 없습니다.</div>
      );
    }

    return (
      <div className="recommend-carousel-container">
        <Slider {...settings}>
          {recommendedCourses.map((course) => (
            <div key={course.id}>
              <Link
                to={`/recommended-course/${course.id}`}
                className="recommend-card-link"
              >
                <div className="recommend-card">
                  <img src={course.img} alt={course.title} />
                  <div className="card-body">
                    <p style={{ color: "var(--brand)", fontSize: 14 }}>
                      {course.location}
                    </p>
                    <p style={{ fontWeight: 600 }}>{course.title}</p>
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
        <h3>
          AI <span style={{ color: "var(--brand)" }}>사용자 맞춤</span> 추천
          코스
        </h3>
        <p style={{ margin: "12px 0 20px" }}>
          개인 맞춤 코스를 추천받고 싶다면?
        </p>
        <button onClick={() => navigate("/login")}>로그인/가입</button>
      </section>

      <section className="review-section">
        <h3>로코코 이용후기</h3>
        <ReviewCarousel />
      </section>
    </main>
  );
}
