// src/pages/OrganizerContentDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrganizerMyPage.css";

export default function OrganizerContentDetail() {
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
                <div className="omp-role">콘텐츠 상세</div>
              </div>
              <ul className="omp-menu">
                <li className="omp-menu-item" onClick={() => nav(-1)}>
                  ← 목록으로
                </li>
              </ul>
            </div>
          </aside>

          <section className="omp-content">
            <div className="omp-card">
              <h1 className="omp-title">콘텐츠 상세</h1>
              <p className="omp-sub">ID: {id}</p>

              <div className="detail-meta">
                <div className="omp-meta-row">
                  <span>등록일</span>2025-08-10
                </div>
                <div className="omp-meta-row">
                  <span>조회</span>120
                </div>
                <div className="omp-meta-row">
                  <span>좋아요</span>18
                </div>
              </div>

              <div className="detail-actions" style={{ marginTop: 16 }}>
                <button
                  className="primary-btn"
                  onClick={() => alert("수정 폼으로 이동(추가 구현)")}
                >
                  수정
                </button>
                <button
                  className="omp-link danger"
                  onClick={() => alert("삭제 확인 모달(추가 구현)")}
                >
                  삭제
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
