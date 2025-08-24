import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./OrganizerMyPage.css";
import {
  fetchProposals,
  fetchPromotions,
  fetchReviewHeads,
  fetchProfile,
  updateProfile,
} from "../api/mypage";

export default function OrganizerMyPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [section, setSection] = useState("proposal");

  // 서버 데이터 상태
  const [proposals, setProposals] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);

  // 초기 로드
  useEffect(() => {
    fetchProposals().then(setProposals).catch(console.error);
    fetchPromotions().then(setPromotions).catch(console.error);
    fetchReviewHeads().then(setReviews).catch(console.error);
    fetchProfile().then(setProfile).catch(console.error);
  }, []);

  // 프로필 수정
  const onSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData(e.target);
      const payload = Object.fromEntries(form.entries());
      await updateProfile(payload);
      alert("저장 완료!");
    } catch (err) {
      alert("프로필 저장 실패");
    }
  };

  return (
    <div className="omp-wrap">
      <main className="omp-main">
        <h2>마이페이지</h2>
        <div className="omp-grid">
          {/* 우측 컨텐츠 */}
          <section className="omp-content">
            {section === "proposal" && (
              <div className="omp-card">
                <h1 className="omp-title">제안/등록 콘텐츠</h1>
                <ul className="omp-list">
                  {proposals.map((p) => (
                    <li key={p.id} className="omp-list-item">
                      <div className="omp-list-title">{p.title}</div>
                      <div className="omp-list-desc">
                        지역: {p.area}　시즌: {p.season}　타깃: {p.target}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section === "promo" && (
              <div className="omp-card">
                <h1 className="omp-title">홍보 콘텐츠</h1>
                <div className="promo-grid">
                  {promotions.map((p) => (
                    <article key={p.id} className="promo-card">
                      <img src={p.imgUrl} alt={p.title} />
                      <div className="promo-title">{p.title}</div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {section === "review" && (
              <div className="omp-card">
                <h1 className="omp-title">리뷰 관리</h1>
                <ul className="omp-list">
                  {reviews.map((r) => (
                    <li key={r.id}>
                      {r.title} - 평균★ {r.avgRate}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section === "profile" && profile && (
              <div className="omp-card">
                <h1 className="omp-title">회원 정보 수정</h1>
                <form className="profile-form" onSubmit={onSaveProfile}>
                  <label>
                    아이디
                    <input name="username" defaultValue={profile.username} />
                  </label>
                  <label>
                    이메일
                    <input name="email" defaultValue={profile.email} />
                  </label>
                  <label>
                    전화번호
                    <input name="phone" defaultValue={profile.phone} />
                  </label>
                  <button className="primary-btn">저장하기</button>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
