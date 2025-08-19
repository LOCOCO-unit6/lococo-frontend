import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./OrganizerMainPage.css";

function ReviewStrip() {
  const base = [
    { id: 1, text: "로코코 추천으로 가족 여행 다녀왔어요! 강추 👍" },
    { id: 2, text: "포토존 코스가 딱 제 취향이었어요 😍" },
    { id: 3, text: "현지 맛집까지 일정에 포함돼서 편했어요." },
    { id: 4, text: "축제 동선 깔끔, 혼잡도 정보 도움됐습니다." },
    { id: 5, text: "부모님 모시고 힐링 코스 성공 ✨" },
  ];
  const items = [...base, ...base];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 6000,
    cssEase: "linear",
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    draggable: false,
    swipe: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="review-row">
      <Slider {...settings}>
        {items.map((it, idx) => (
          <div key={`${it.id}-${idx}`} className="review-cell">
            <div className="review-chip">
              <span className="stars">★★★★★</span>
              <span className="text">{it.text}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default function OrganizerMainPage() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);

  // 로그인 전: 버튼으로 바로 진입
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
      {/* 상단 그리드: 좌측 2카드 + 우측 콜라주 */}
      <section className="hero-grid">
        <div className="left-cards">
          <div className="feature-card">
            <div className="feature-icon">🪄</div>
            <div className="feature-title">AI 기획 도우미</div>
            <p className="feature-desc">
              축제 정보를 입력하면 로코코가 기획 초안을 도와드립니다.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧩</div>
            <div className="feature-title">AI 홍보 콘텐츠 생성</div>
            <p className="feature-desc">
              포스터·배너·숏폼 초안을 자동 생성해 드려요.
            </p>
          </div>
        </div>

        <div className="collage">
          <div className="collage-top">
            <div className="tile lg">
              경기도 축제
              <br />
              가나다 축제
            </div>
            <div className="tile sm">현장 스냅</div>
            <div className="tile sm">거리 풍경</div>
            <div className="tile sm">포토존</div>
            <div className="tile sm">부스 운영</div>
          </div>
          <div className="collage-bottom">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="thumb" key={i}>
                썸네일
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용후기 가로 스트립 */}
      <section className="reviews-section">
        <h3>로코코 이용후기</h3>
        <ReviewStrip />
      </section>

      {/* 중간 카드형 안내 2행 */}
      <section className="mid-articles">
        <div className="article">
          <div className="article-meta">시작가이드</div>
          <div className="article-title">어떻게 시작해야 할지 막막한가요?</div>
          <p className="article-desc">
            기본 정보를 입력하면 로코코가 기획 브리프를 제안해 드려요.
          </p>
          <div className="article-preview">폼 미리보기</div>
        </div>
        <div className="article">
          <div className="article-meta">제작/운영도움</div>
          <div className="article-title">기획에서 끝? 아니요, 제작까지</div>
          <p className="article-desc">
            현장 안내 이미지/홍보 콘텐츠까지 자동 생성·수정·승인 워크플로우.
          </p>
          <div className="article-preview">콘텐츠 샘플</div>
        </div>
      </section>

      {/* 베이지 톤 대형 섹션 */}
      <section className="beige-band">
        <div className="band-inner">
          <div className="band-icon">➤</div>
          <div>
            <div className="band-title">
              기획에서 끝? 아니요, 홍보 콘텐츠까지 제작해 드려요
            </div>
            <p className="band-desc">
              숏폼/배너/포스터 자동 초안과 간편한 승인/수정 요청으로 시간을
              아껴요.
            </p>
          </div>
        </div>
      </section>

      {/* 하단 안내 (콘텐츠 등록 & 통합홍보) */}
      <section className="bottom-info">
        <div className="info-left">
          <div className="info-meta">콘텐츠 등록</div>
          <div className="info-title">
            콘텐츠 등록 그리고 통합까지, 로코코 하나로 전부
          </div>
          <p className="info-desc">
            인스타/틱톡/유튜브 동시 스케줄, 추적링크 자동, 통합 리포트 제공.
          </p>
        </div>
        <div className="info-visual">업로더 미리보기</div>
      </section>
    </main>
  );
}
