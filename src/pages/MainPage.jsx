import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./MainPage.css";

function ReviewCarousel() {
  const base = [
    { id: 1, text: "로코코 추천으로 가족 여행 다녀왔어요! 강추 👍" },
    { id: 2, text: "포토존 코스가 딱 제 취향이었어요 😍" },
    { id: 3, text: "현지 맛집까지 일정에 포함돼서 편했어요." },
    { id: 4, text: "축제 동선 깔끔, 혼잡도 정보 도움됐습니다." },
    { id: 5, text: "부모님 모시고 힐링 코스 성공 ✨" },
  ];
  const items = [...base, ...base, ...base]; // 끊김 줄이기용 복제

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0, // 연속 흐름 핵심
    speed: 6000, // 흐르는 속도
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

  return (
    <main className="main-page">
      {/* 배너 */}
      <section className="banner-section">
        <div style={{ position: "relative" }}>
          <img
            src="/images/banner1.jpg"
            alt="메인 배너"
            className="banner-image"
          />
          <div className="banner-overlay">
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
              경기도 용인시 가나다 축제
            </h2>
          </div>
        </div>
      </section>

      {/* 추천 코스 */}
      <section className="recommend-section">
        <h3>추천 코스</h3>
        <div className="recommend-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="recommend-card">
              <img src={`/images/course${i}.jpg`} alt={`코스 ${i}`} />
              <div className="card-body">
                <p style={{ color: "var(--brand)", fontSize: 14 }}>
                  경기도 수원시
                </p>
                <p style={{ fontWeight: 600 }}>행궁동 골목여행</p>
              </div>
            </div>
          ))}
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
