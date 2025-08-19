// src/OrganizerMyPage.jsx
import React, { useState } from "react";
import "./OrganizerMyPage.css";

export default function OrganizerMyPage() {
  const [tab, setTab] = useState("all"); // all | proposal | contents

  // 데모 데이터 (API 붙이기 전)
  const items = [
    {
      id: 1,
      type: "제안서",
      title: "용인 가을 축제",
      date: "2025-08-08",
      status: "검토중",
      views: 97,
      likes: 12,
    },
    {
      id: 2,
      type: "등록 콘텐츠",
      title: "홍보 콘텐츠#1",
      date: "2025-08-08",
      status: "승인",
      views: 62,
      likes: 8,
    },
    {
      id: 3,
      type: "등록 콘텐츠",
      title: "홍보 콘텐츠#2",
      date: "2025-08-08",
      status: "임시저장",
      views: 15,
      likes: 0,
    },
    {
      id: 4,
      type: "제안서",
      title: "핸드메이드 마켓",
      date: "2025-08-08",
      status: "반려",
      views: 121,
      likes: 5,
    },
  ];

  const filtered = items.filter((it) =>
    tab === "all"
      ? true
      : tab === "proposal"
      ? it.type === "제안서"
      : it.type === "등록 콘텐츠"
  );

  return (
    <div className="omp-wrap">
      {/* ✅ 내부 헤더(omp-top) 제거: 상단 헤더는 App.js에서만 렌더 */}

      <main className="omp-main">
        <h1 className="omp-title">마이페이지</h1>
        <p className="omp-sub">
          사용자 정보 확인과 맞춤 기능을 이용하실 수 있습니다.
        </p>

        <section className="omp-grid">
          {/* 좌측 사이드 카드 */}
          <aside className="omp-side">
            <div className="omp-card omp-profile">
              <div className="omp-avatar">홍</div>
              <div className="omp-profile-info">
                <div className="omp-name">홍길동 님</div>
                <div className="omp-role">회원정보 수정</div>
              </div>
              <ul className="omp-menu">
                <li className="omp-menu-head">제안서 및 등록 리스트</li>
                <li>홍보 콘텐츠 리스트</li>
                <li>리뷰 관리</li>
                <li>로그아웃</li>
              </ul>
            </div>
          </aside>

          {/* 우측 콘텐츠 리스트 */}
          <section className="omp-content">
            <div className="omp-card">
              <div className="omp-card-head">
                <h2>제안서 및 등록 콘텐츠 리스트</h2>
                <div className="omp-tabs">
                  <button
                    className={`omp-tab ${tab === "all" ? "is-active" : ""}`}
                    onClick={() => setTab("all")}
                  >
                    전체
                  </button>
                  <button
                    className={`omp-tab ${
                      tab === "proposal" ? "is-active" : ""
                    }`}
                    onClick={() => setTab("proposal")}
                  >
                    제안서
                  </button>
                  <button
                    className={`omp-tab ${
                      tab === "contents" ? "is-active" : ""
                    }`}
                    onClick={() => setTab("contents")}
                  >
                    등록 콘텐츠
                  </button>
                </div>
              </div>

              <ul className="omp-list">
                {filtered.map((it) => (
                  <li key={it.id} className="omp-list-item">
                    <div className="omp-badge">{it.type}</div>
                    <div className="omp-list-mid">
                      <div className="omp-list-title">{it.title}</div>
                      <div className="omp-list-desc">
                        지역·장르·타깃 등 요약 문구가 들어갑니다 (샘플)
                      </div>
                    </div>
                    <div className="omp-meta">
                      <div className="omp-meta-row">
                        <span>상태</span>
                        {it.status}
                      </div>
                      <div className="omp-meta-row">
                        <span>등록일</span>
                        {it.date}
                      </div>
                      <div className="omp-meta-row">
                        <span>조회</span>
                        {it.views}
                      </div>
                      <div className="omp-meta-row">
                        <span>좋아요</span>
                        {it.likes}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
