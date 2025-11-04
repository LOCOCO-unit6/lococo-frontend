import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./OrganizerMainPage.css";
import mainVisual from "../image/main.png";

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
export default function OrganizerMainPage() {
  const [isAuthed, setIsAuthed] = useState(true);

  if (!isAuthed) {
    return (
      <main className="login-page">
        <section className="login-section">
          <h2>주최자 로그인</h2>
          <button onClick={() => setIsAuthed(true)}>주최자용 로그인</button>
        </section>
      </main>
    );
  }

  return (
    <main className="main-page organizer">
      <section className="hero-grid">
        <div className="left-cards">
          <article className="feature-card">
            <div className="feature-card-head">
              <div className="feature-icon">🪄</div>
              <h3 className="feature-title">AI 기획 도우미</h3>
            </div>
            <p className="feature-desc">
              축제 핵심 정보를 입력하면 로코코가 기획 브리프 초안을 자동으로
              제안합니다.
            </p>
            <div className="feature-actions">
              <button className="feature-btn">기획 시작</button>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-card-head">
              <div className="feature-icon">🧩</div>
              <h3 className="feature-title">AI 홍보 콘텐츠 생성</h3>
            </div>
            <p className="feature-desc">
              포스터·배너·숏폼 초안 자동 생성. 승인/수정 워크플로우로 바로 배포.
            </p>
            <div className="feature-actions">
              <button className="feature-btn">콘텐츠 만들기</button>
            </div>
          </article>
        </div>

        <div className="hero-image">
          <img src={mainVisual} alt="주최자 메인 비주얼" />
        </div>
      </section>

      {/* ===== 이용후기 ===== */}
      <section className="reviews-section">
        <h3>로코코 이용후기</h3>
        <ReviewCarousel />
      </section>

      <section className="feature-band bleed white">
        <div className="band-inner wide">
          <div className="band-meta">시작가이드</div>
          <h3 className="band-title">어떻게 시작해야 할지 막막한가요?</h3>
          <p className="band-desc">
            기본 정보를 입력하면 로코코가 기획 브리프를 자동으로 제안해 드려요.
          </p>
        </div>
      </section>

      {/* 2. 홍보 콘텐츠  */}
      <section className="feature-band bleed beige">
        <div className="band-inner wide">
          <div className="band-meta">AI 홍보 콘텐츠 생성</div>
          <h3 className="band-title">
            기획에서 끝? 아니요, 홍보 콘텐츠까지 제작해 드려요
          </h3>
          <p className="band-desc">
            숏폼/배너/포스터 자동 초안과 간편한 승인/수정 요청으로 시간을
            아껴요.
          </p>
        </div>
      </section>

      {/* 3. 콘텐츠 등록  */}
      <section className="feature-band bleed white">
        <div className="band-inner wide">
          <div className="band-meta">콘텐츠 등록</div>
          <h3 className="band-title">
            콘텐츠 등록 그리고 통합까지, 로코코 하나로 전부
          </h3>
          <p className="band-desc">
            인스타/틱톡/유튜브 동시 스케줄, 추적링크 자동, 통합 리포트 제공.
          </p>
        </div>
      </section>
    </main>
  );
}
