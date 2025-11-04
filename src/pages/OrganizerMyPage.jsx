import React, { useState, useEffect } from "react";
import "./OrganizerMyPage.css";
import { fetchOrganizerMypage, updateOrganizerProfile } from "../utils/Api";

export default function OrganizerMyPage() {
  const [section, setSection] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [proposals, setProposals] = useState([]);

  const organizerId = localStorage.getItem("organizerId");

  /** ✅ 페이지 로드시 주최자 마이페이지 정보 불러오기 */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrganizerMypage();
        setProfile({
          displayName: data.userName,
          affiliation: data.affiliation || "",
          phoneNumber: data.phoneNumber || "",
        });
        if (data.likedFestivals) setPromotions(data.likedFestivals);
      } catch (err) {
        console.error("❌ 주최자 정보 로드 실패:", err);
      }
    };
    load();
  }, []);

  /** ✅ 프로필 수정 */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    try {
      await updateOrganizerProfile(organizerId, payload);
      alert("프로필이 성공적으로 수정되었습니다!");
    } catch (err) {
      console.error(err);
      alert("프로필 수정 실패");
    }
  };

  return (
    <div className="omp-wrap">
      <main className="omp-main">
        <h2>주최자 마이페이지</h2>

        {/* 왼쪽 메뉴 */}
        <nav className="omp-menu">
          <button
            className={section === "profile" ? "active" : ""}
            onClick={() => setSection("profile")}
          >
            회원 정보 수정
          </button>
          <button
            className={section === "proposal" ? "active" : ""}
            onClick={() => setSection("proposal")}
          >
            제안 콘텐츠
          </button>
          <button
            className={section === "promo" ? "active" : ""}
            onClick={() => setSection("promo")}
          >
            홍보 콘텐츠
          </button>
          <button
            className={section === "review" ? "active" : ""}
            onClick={() => setSection("review")}
          >
            리뷰 관리
          </button>
        </nav>

        {/* 오른쪽 콘텐츠 */}
        <section className="omp-content">
          {/* ✅ 회원 정보 수정 */}
          {section === "profile" && profile && (
            <div className="omp-card">
              <h1 className="omp-title">회원 정보 수정</h1>
              <form onSubmit={handleSaveProfile} className="profile-form">
                <label>
                  표시 이름
                  <input
                    name="displayName"
                    defaultValue={profile.displayName}
                  />
                </label>
                <label>
                  소속
                  <input
                    name="affiliation"
                    defaultValue={profile.affiliation}
                  />
                </label>
                <label>
                  전화번호
                  <input
                    name="phoneNumber"
                    defaultValue={profile.phoneNumber}
                  />
                </label>
                <label>
                  비밀번호
                  <input
                    name="password"
                    type="password"
                    placeholder="새 비밀번호"
                  />
                </label>
                <label>
                  비밀번호 확인
                  <input
                    name="passwordCheck"
                    type="password"
                    placeholder="비밀번호 확인"
                  />
                </label>
                <button type="submit" className="primary-btn">
                  저장하기
                </button>
              </form>
            </div>
          )}

          {/* ✅ 제안 콘텐츠 */}
          {section === "proposal" && (
            <div className="omp-card">
              <h1 className="omp-title">제안 콘텐츠</h1>
              {proposals.length === 0 ? (
                <p>등록된 제안이 없습니다.</p>
              ) : (
                <ul className="omp-list">
                  {proposals.map((p) => (
                    <li key={p.id} className="omp-list-item">
                      <div className="omp-list-title">{p.title}</div>
                      <div className="omp-list-desc">
                        지역: {p.region} 시즌: {p.season} 타깃: {p.target}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ✅ 홍보 콘텐츠 */}
          {section === "promo" && (
            <div className="omp-card">
              <h1 className="omp-title">홍보 콘텐츠</h1>
              {promotions.length === 0 ? (
                <p>등록된 홍보 콘텐츠가 없습니다.</p>
              ) : (
                <div className="promo-grid">
                  {promotions.map((p) => (
                    <article key={p.id} className="promo-card">
                      <img src={p.imgUrl} alt={p.title} />
                      <div className="promo-title">{p.title}</div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ✅ 리뷰 관리 */}
          {section === "review" && (
            <div className="omp-card">
              <h1 className="omp-title">리뷰 관리</h1>
              {reviews.length === 0 ? (
                <p>아직 리뷰가 없습니다.</p>
              ) : (
                <ul className="omp-list">
                  {reviews.map((r) => (
                    <li key={r.id}>
                      {r.title} - 평균★ {r.avgRate}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
