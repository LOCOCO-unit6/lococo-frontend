import React, { useState, useEffect } from "react";
import "./OrganizerMyPage.css";
import { fetchOrganizerMypage, updateOrganizerProfile } from "../utils/Api";

export default function OrganizerMyPage() {
  const [section, setSection] = useState("profile");
  const [profile, setProfile] = useState({
    displayName: "",
    affiliation: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [proposals, setProposals] = useState([]);

  const organizerId = localStorage.getItem("organizerId");

  /** ✅ 페이지 로드시 주최자 정보 불러오기 */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchOrganizerMypage();
        setProfile({
          displayName: data.userName || "",
          affiliation: data.affiliation || "",
          phoneNumber: data.phoneNumber || "",
        });
        if (data.likedFestivals) setPromotions(data.likedFestivals);
      } catch (err) {
        console.error("❌ 주최자 정보 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /** ✅ 입력 변경 핸들러 (입력 즉시 상태에 반영) */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 프로필 저장 */
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!organizerId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await updateOrganizerProfile(organizerId, profile);
      alert("✅ 프로필이 성공적으로 수정되었습니다!");
    } catch (err) {
      console.error("❌ 프로필 수정 실패:", err);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) return <div className="omp-wrap">로딩 중...</div>;

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
          {section === "profile" && (
            <div className="omp-card">
              <h1 className="omp-title">회원 정보 수정</h1>
              <form onSubmit={handleSaveProfile} className="profile-form">
                <label>
                  표시 이름
                  <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  소속
                  <input
                    name="affiliation"
                    value={profile.affiliation}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  전화번호
                  <input
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  비밀번호
                  <input
                    name="password"
                    type="password"
                    placeholder="새 비밀번호"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  비밀번호 확인
                  <input
                    name="passwordCheck"
                    type="password"
                    placeholder="비밀번호 확인"
                    onChange={handleChange}
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
