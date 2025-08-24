import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "./MainPage.css";

function BannerCarousel() {
  const banners = [
    {
      id: 1,
      img: "/image/banner1.png",
      text: "경기도 용인시 가나다 축제",
    },
    { id: 2, img: "/image/banner2.jpg", text: "베너 2" },
    { id: 3, img: "/image/banner3.jpg", text: "베너 3" },
    { id: 4, img: "/image/banner4.jpg", text: "베너 4" },
  ];

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
          <div className="banner-slide">
            <img src={banner.img} alt={banner.text} className="banner-image" />
            <div className="banner-overlay">
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
                {banner.text}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

function ReviewCarousel() {
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

  // 추천 코스 데이터 배열을 MainPage 컴포넌트 내부에 정의합니다.
  const recommendedCourses = [
    {
      id: 1,
      img: "/images/course1.jpg",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
    },
    {
      id: 2,
      img: "/images/course2.jpg",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
    },
    {
      id: 3,
      img: "/images/course3.jpg",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
    },
    {
      id: 4,
      img: "/images/course4.jpg",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
    },
    {
      id: 5,
      img: "/images/course5.jpg",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
    },
  ];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <main className="main-page">
      {/* 배너 섹션 */}
      <section className="banner-section">
        <BannerCarousel />
      </section>

      {/* 추천 코스 */}
      <section className="recommend-section">
        <h3>추천 코스</h3>
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
      </section>

      {/* AI 맞춤 추천 */}
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

      {/* 이용 후기 */}
      <section className="review-section">
        <h3>로코코 이용후기</h3>
        <ReviewCarousel />
      </section>
    </main>
  );
}
