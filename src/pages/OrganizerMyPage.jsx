// src/pages/OrganizerMyPage.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./OrganizerMyPage.css";

/** 좌측 사이드바  */
function OmpSidebar({ active, onSelect, userName = "운영자" }) {
  const navItem = (key, label) => (
    <li className={active === key ? "active" : ""}>
      <Link
        to={`?section=${key}`}
        onClick={(e) => {
          e.preventDefault();
          onSelect(key);
        }}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <aside className="omp-side">
      <div className="omp-card omp-profile">
        <div className="omp-profile-info">
          <div className="omp-name">{userName} 님</div>
          <Link
            to="?section=profile"
            className="omp-role"
            onClick={(e) => {
              e.preventDefault();
              onSelect("profile");
            }}
          >
            회원 정보 수정
          </Link>
        </div>

        <ul className="omp-menu">
          <li className="omp-menu-head">메뉴</li>
          {navItem("proposal", "제안/등록 콘텐츠")}
          {navItem("promo", "홍보 콘텐츠")}
          {navItem("review", "후기 관리")}
          <li>
            <Link to="/logout" className="logout-link">
              로그아웃
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default function OrganizerMyPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- 섹션 상태 (좌측 메뉴) ----------
  // URL ?section=proposal|promo|review|profile
  const initialSection = searchParams.get("section") || "proposal";
  const [section, setSection] = useState(
    ["proposal", "promo", "review", "profile"].includes(initialSection)
      ? initialSection
      : "proposal"
  );

  // 섹션 변경 시 URL 쿼리 동기화
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next, { replace: true });
  }, [section]);

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

  // 섹션 바뀌면 탭 초기화
  useEffect(() => {
    setProposalTab("all");
    setPromoTab("전체");
  }, [section]);

  // ---------- 필터링 ----------
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

  // ---------- 공통 제목 ----------
  const TopTitle = useCallback(
    ({ title, sub }) => (
      <>
        <h1 className="omp-title">{title}</h1>
        <p className="omp-sub">{sub}</p>
      </>
    ),
    []
  );

  return (
    <div className="omp-wrap">
      <main className="omp-main">
        <h2>마이페이지</h2>
        <p>사용자 정보 관리 및 각종 기능을 이용하실 수 있습니다.</p>
        <div className="omp-grid">
          {/* 좌측 사이드바 */}
          <OmpSidebar
            active={section}
            onSelect={setSection}
            userName="lococo25"
          />

          {/* 우측 컨텐츠 */}
          <section className="omp-content">
            {/* ① 제안/등록 콘텐츠 */}
            {section === "proposal" && (
              <div className="omp-card">
                <TopTitle
                  title="제안/등록 콘텐츠"
                  sub="내가 작성한 제안서 및 등록된 콘텐츠를 확인하세요."
                />

                <div className="omp-tabs">
                  {[
                    { key: "all", label: "전체" },
                    { key: "proposal", label: "제안서" },
                    { key: "contents", label: "등록 콘텐츠" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      className={`omp-tab ${
                        proposalTab === t.key ? "is-active" : ""
                      }`}
                      onClick={() => setProposalTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <ul className="omp-list">
                  {filteredProposal.map((p) => (
                    <li key={p.id} className="omp-list-item">
                      <div className="omp-badge">{p.type}</div>
                      <div className="omp-list-mid">
                        <div className="omp-list-title">{p.title}</div>
                        <div className="omp-list-desc">
                          지역: {p.area} 　시즌: {p.season} 　타깃: {p.target}
                        </div>
                        <div className="omp-list-actions">
                          <button
                            className="omp-link"
                            onClick={() =>
                              navigate(
                                `/organizer/mypage/${
                                  p.type === "제안서" ? "proposal" : "content"
                                }/${p.id}`
                              )
                            }
                          >
                            상세 보기
                          </button>
                          <button
                            className="omp-link weak"
                            onClick={() =>
                              navigate(
                                `/organizer/mypage/${
                                  p.type === "제안서" ? "proposal" : "content"
                                }/${p.id}/edit`
                              )
                            }
                          >
                            수정
                          </button>
                        </div>
                      </div>
                      <div className="omp-meta">
                        <div className="omp-meta-row">
                          <span>조회</span>
                          {p.views}
                        </div>
                        <div className="omp-meta-row">
                          <span>좋아요</span>
                          {p.likes}
                        </div>
                        <div className="omp-meta-row">
                          <span>등록일</span>
                          {p.date}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ② 홍보 콘텐츠 리스트 */}
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
                        <img
                          src={p.img}
                          alt={p.title}
                          onError={(e) => {
                            e.currentTarget.src = "/img/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="promo-kind">{p.kind}</div>
                      <div className="promo-title">{p.title}</div>
                      <div className="promo-date">{p.date}</div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ③ 리뷰 관리 */}
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

            {/* ④ 회원 정보 수정 */}
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
        </div>
      </main>
    </div>
  );
}
