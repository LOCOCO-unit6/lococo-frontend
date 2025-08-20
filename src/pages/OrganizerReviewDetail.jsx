// src/pages/OrganizerReviewDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrganizerMyPage.css";

const dummyReviews = [
  {
    id: 1,
    user: "홍길동",
    rate: 5,
    text: "로코코에서 추천받은 여행으로 가족 여행을 다녀왔어요. 강추합니다.",
    date: "4일 전",
  },
  {
    id: 2,
    user: "홍길동",
    rate: 4,
    text: "동선이 깔끔했고 아이들이 좋아했어요!",
    date: "5일 전",
  },
  {
    id: 3,
    user: "홍길동",
    rate: 5,
    text: "리뷰 예시 문장입니다. 전반적으로 만족합니다.",
    date: "6일 전",
  },
  {
    id: 4,
    user: "홍길동",
    rate: 5,
    text: "사진 스팟이 많아서 좋았어요!",
    date: "1주 전",
  },
];

export default function OrganizerReviewDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  return (
    <div className="omp-wrap">
      <main className="omp-main">
        <section className="omp-grid">
          <aside className="omp-side">
            <div className="omp-card omp-profile">
              <div className="omp-avatar">홍</div>
              <div className="omp-profile-info">
                <div className="omp-name">홍길동 님</div>
                <div className="omp-role">리뷰 관리</div>
              </div>
              <ul className="omp-menu">
                <li
                  className="omp-menu-item"
                  onClick={() => nav("/organizer/mypage?sec=review")}
                >
                  ← 리뷰 목록으로
                </li>
              </ul>
            </div>
          </aside>

          <section className="omp-content">
            <div className="omp-card">
              <h1 className="omp-title">리뷰 관리</h1>
              <p className="omp-sub">콘텐츠 ID: {id}</p>

              <ul className="review-list">
                {dummyReviews.map((r) => (
                  <li key={r.id} className="review-item">
                    <div className="stars" data-rate={r.rate}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className={`star ${i < r.rate ? "on" : ""}`}>
                          ★
                        </i>
                      ))}
                    </div>
                    <div className="review-user">{r.user}</div>
                    <div className="review-text">{r.text}</div>
                    <div className="review-date">{r.date}</div>
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
