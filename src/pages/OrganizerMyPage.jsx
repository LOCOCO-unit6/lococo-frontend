// src/pages/OrganizerMyPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./OrganizerMyPage.css";

export default function OrganizerMyPage() {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  // 좌측 메뉴 섹션: proposal(제안/등록), promo(홍보콘텐츠), review(리뷰관리), profile(회원정보)
  const section = search.get("sec") || "proposal";
  const setSection = (sec) => {
    const next = new URLSearchParams(search);
    next.set("sec", sec);
    setSearch(next, { replace: false });
  };

  // ---------- 데모 데이터 ----------
  const proposalItems = useMemo(
    () => [
      {
        id: 1,
        type: "제안서",
        title: "용인 가나다 축제",
        date: "2025-08-10",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
        views: 98,
        likes: 12,
      },
      {
        id: 2,
        type: "등록 콘텐츠",
        title: "용인 가나다 축제",
        date: "2025-08-10",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
        views: 35,
        likes: 4,
      },
      {
        id: 3,
        type: "등록 콘텐츠",
        title: "용인 abc 축제",
        date: "2025-08-10",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
        views: 57,
        likes: 9,
      },
      {
        id: 4,
        type: "제안서",
        title: "용인 abc 축제",
        date: "2025-08-10",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
        views: 112,
        likes: 21,
      },
    ],
    []
  );

  const promoItems = useMemo(
    () => [
      {
        id: 11,
        kind: "포스터",
        title: "행궁동 골목여행",
        date: "2025-08-10",
        img: "/img/promo1.jpg",
      },
      {
        id: 12,
        kind: "인스타",
        title: "용인 가나다 축제",
        date: "2025-08-10",
        img: "/img/promo2.jpg",
      },
      {
        id: 13,
        kind: "포스터",
        title: "행궁동 골목여행",
        date: "2025-08-09",
        img: "/img/promo3.jpg",
      },
      {
        id: 14,
        kind: "포스터",
        title: "행궁동 골목여행",
        date: "2025-08-09",
        img: "/img/promo1.jpg",
      },
      {
        id: 15,
        kind: "인스타",
        title: "용인 가나다 축제",
        date: "2025-08-10",
        img: "/img/promo2.jpg",
      },
      {
        id: 16,
        kind: "블로그",
        title: "행궁동 골목여행",
        date: "2025-08-09",
        img: "/img/promo3.jpg",
      },
    ],
    []
  );

  const reviewHeads = useMemo(
    () => [
      {
        id: 21,
        title: "용인 가나다 축제",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
      },
      {
        id: 22,
        title: "용인 abc 축제",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
      },
      {
        id: 23,
        title: "용인 abc 축제",
        area: "경기도 용인시",
        season: "여름",
        target: "초등학생",
      },
    ],
    []
  );

  // ---------- 탭 상태(섹션별) ----------
  const [proposalTab, setProposalTab] = useState("all"); // all | proposal | contents
  const [promoTab, setPromoTab] = useState("전체"); // 전체 | 포스터 | 인스타 | 블로그

  // 섹션 바뀌면 탭 초기화(디자인 스펙 편의)
  useEffect(() => {
    setProposalTab("all");
    setPromoTab("전체");
  }, [section]);

  // 필터링
  const filteredProposal = proposalItems.filter((it) =>
    proposalTab === "all"
      ? true
      : proposalTab === "proposal"
      ? it.type === "제안서"
      : it.type === "등록 콘텐츠"
  );
  const filteredPromo = promoItems.filter((it) =>
    promoTab === "전체" ? true : it.kind === promoTab
  );

  // 공통 작은 헤더
  const TopTitle = ({ title, sub }) => (
    <>
      <h1 className="omp-title">{title}</h1>
      <p className="omp-sub">{sub}</p>
    </>
  );

  // -------------------- UI --------------------
  return (
    <div className="omp-wrap">
      <main className="omp-main">
        <h1 className="omp-title">마이페이지</h1>
        <p className="omp-sub">
          사용자 정보 확인과 맞춤 기능을 이용하실 수 있습니다.
        </p>

        {/* 좌측 메뉴 */}
        <section className="omp-grid">
          <aside className="omp-side">
            <div className="omp-card omp-profile">
              <div className="omp-avatar">홍</div>
              <div className="omp-profile-info">
                <div className="omp-name">홍길동 님</div>
                <li
                  className={`omp-menu-item ${
                    section === "profile" ? "is-active" : ""
                  }`}
                  onClick={() => setSection("profile")}
                >
                  회원 정보 수정
                </li>
              </div>

              <ul className="omp-menu">
                <li
                  className={`omp-menu-item ${
                    section === "proposal" ? "is-active" : ""
                  }`}
                  onClick={() => setSection("proposal")}
                >
                  제안서 및 등록 리스트
                </li>

                <li
                  className={`omp-menu-item ${
                    section === "promo" ? "is-active" : ""
                  }`}
                  onClick={() => setSection("promo")}
                >
                  홍보 콘텐츠 리스트
                </li>
                <li
                  className={`omp-menu-item ${
                    section === "review" ? "is-active" : ""
                  }`}
                  onClick={() => setSection("review")}
                >
                  리뷰 관리
                </li>

                <li className="omp-menu-item" onClick={() => navigate("/")}>
                  로그아웃
                </li>
              </ul>
            </div>
          </aside>

          {/* 우측 컨텐트 */}
          <section className="omp-content">
            {/* ① 제안서 및 등록 콘텐츠 리스트 */}
            {section === "proposal" && (
              <div className="omp-card">
                <TopTitle
                  title="제안서 및 등록 콘텐츠 리스트"
                  sub="작성한 제안서와 등록한 콘텐츠를 확인하세요."
                />
                <div className="omp-tabs">
                  <button
                    className={`omp-tab ${
                      proposalTab === "all" ? "is-active" : ""
                    }`}
                    onClick={() => setProposalTab("all")}
                  >
                    전체
                  </button>
                  <button
                    className={`omp-tab ${
                      proposalTab === "proposal" ? "is-active" : ""
                    }`}
                    onClick={() => setProposalTab("proposal")}
                  >
                    제안서
                  </button>
                  <button
                    className={`omp-tab ${
                      proposalTab === "contents" ? "is-active" : ""
                    }`}
                    onClick={() => setProposalTab("contents")}
                  >
                    등록 콘텐츠
                  </button>
                </div>

                <ul className="omp-list">
                  {filteredProposal.map((it) => (
                    <li key={it.id} className="omp-list-item">
                      <div className="omp-badge">{it.type}</div>

                      <div className="omp-list-mid">
                        <div className="omp-list-title">{it.title}</div>
                        <div className="omp-list-desc">
                          지역: {it.area} 　시즌: {it.season} 　타깃:{" "}
                          {it.target}
                        </div>
                        <div className="omp-list-actions">
                          <button
                            className="omp-link"
                            onClick={() =>
                              navigate(`/organizer/mypage/content/${it.id}`)
                            }
                          >
                            상세보기
                          </button>
                          <button className="omp-link">수정</button>
                          <button className="omp-link danger">삭제</button>
                        </div>
                      </div>

                      <div className="omp-meta">
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
            )}

            {/* ② 홍보 콘텐츠 리스트(그리드) */}
            {section === "promo" && (
              <div className="omp-card">
                <TopTitle
                  title="홍보 콘텐츠 리스트"
                  sub="포스터/인스타/블로그 유형별로 확인하세요."
                />
                <div className="omp-tabs">
                  {["전체", "포스터", "인스타", "블로그"].map((t) => (
                    <button
                      key={t}
                      className={`omp-tab ${promoTab === t ? "is-active" : ""}`}
                      onClick={() => setPromoTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="promo-grid">
                  {filteredPromo.map((p) => (
                    <article
                      key={p.id}
                      className="promo-card"
                      onClick={() =>
                        navigate(`/organizer/mypage/content/${p.id}`)
                      }
                    >
                      <div className="promo-thumb">
                        {/* 프로젝트 이미지 자산에 맞춰 교체 */}
                        <img src={p.img} alt={p.title} />
                      </div>
                      <div className="promo-kind">{p.kind}</div>
                      <div className="promo-title">{p.title}</div>
                      <div className="promo-date">{p.date}</div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ③ 리뷰 관리(리스트) */}
            {section === "review" && (
              <div className="omp-card">
                <TopTitle
                  title="리뷰 관리"
                  sub="리뷰를 확인할 콘텐츠를 선택하세요."
                />
                <ul className="omp-list">
                  {reviewHeads.map((r) => (
                    <li key={r.id} className="omp-list-item">
                      <div className="omp-badge">등록 콘텐츠</div>
                      <div className="omp-list-mid">
                        <div className="omp-list-title">{r.title}</div>
                        <div className="omp-list-desc">
                          지역: {r.area} 　시즌: {r.season} 　타깃: {r.target}
                        </div>
                        <div className="omp-list-actions">
                          <button
                            className="omp-link"
                            onClick={() =>
                              navigate(`/organizer/mypage/review/${r.id}`)
                            }
                          >
                            리뷰 보기
                          </button>
                        </div>
                      </div>
                      <div className="omp-meta">
                        <div className="omp-meta-row">
                          <span>신규</span>3개
                        </div>
                        <div className="omp-meta-row">
                          <span>총 리뷰</span>12개
                        </div>
                        <div className="omp-meta-row">
                          <span>평균★</span>4.7
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ④ 회원 정보 수정(폼) */}
            {section === "profile" && (
              <div className="omp-card">
                <TopTitle
                  title="회원 정보 수정"
                  sub="아이디/연락처/소속기관을 변경할 수 있습니다."
                />
                <form
                  className="profile-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label>
                    아이디
                    <input type="text" defaultValue="lococo25" />
                  </label>
                  <label>
                    비밀번호
                    <input type="password" defaultValue="********" />
                  </label>
                  <label>
                    비밀번호 확인
                    <input type="password" defaultValue="********" />
                  </label>
                  <label>
                    이메일
                    <input type="email" defaultValue="lococo25@naver.com" />
                  </label>
                  <label>
                    전화번호
                    <input type="tel" defaultValue="010-1234-5678" />
                  </label>
                  <label>
                    소속기관명
                    <input type="text" defaultValue="용인시청" />
                  </label>
                  <button className="primary-btn">저장하기</button>
                </form>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
