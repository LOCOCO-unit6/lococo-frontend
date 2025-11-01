import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyPageSidebar from "../components/MyPageSidebar";
import "./Profile.css";
import { fetchUserInfo, updatePersonalProfile } from "../utils/Api.js";

const Profile = () => {
  // ⚠️ ID는 useParams()로 받지만, API는 로그인된 사용자의 ID를 사용해야 하므로
  // 실제 로직에서는 localStorage 등에서 userId를 가져오는 것이 일반적입니다.
  // 여기서는 일단 'user-id'가 경로에 있다고 가정합니다.
  const { id: userIdFromParam } = useParams();

  const [form, setForm] = useState({
    identification: "", // 'id' 대신 identification 사용 (Login.jsx 참고)
    password: "",
    confirmPassword: "",
    name: "",
    region: "", // 지역 (시)
    district: "", // 지역 (구)
    email: "",
    phoneNumber: "", // 'phone' 대신 phoneNumber 사용
    // 🚨 서버에서 userId를 받아서 상태에 저장하여 수정 시 사용합니다.
    userId: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [userName, setUserName] = useState("로딩 중"); // 사이드바용 이름
  const [activeMenu, setActiveMenu] = useState("profile-edit");
  const regions = {
    cities: [
      "서울특별시",
      "부산광역시",
      "대구광역시",
      "인천광역시",
      "광주광역시",
      "대전광역시",
      "울산광역시",
      "세종특별자치시",
      "경기도",
      "강원도",
      "충청북도",
      "충청남도",
      "전라북도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ],
    districts: {
      서울특별시: [
        "종로구",
        "중구",
        "용산구",
        "성동구",
        "광진구",
        "동대문구",
        "중랑구",
        "성북구",
        "강북구",
        "도봉구",
        "노원구",
        "은평구",
        "서대문구",
        "마포구",
        "양천구",
        "강서구",
        "구로구",
        "금천구",
        "영등포구",
        "동작구",
        "관악구",
        "서초구",
        "강남구",
        "송파구",
        "강동구",
      ],
      부산광역시: [
        "중구",
        "서구",
        "동구",
        "영도구",
        "부산진구",
        "동래구",
        "남구",
        "북구",
        "해운대구",
        "사하구",
        "금정구",
        "강서구",
        "연제구",
        "수영구",
        "사상구",
        "기장군",
      ],
      대구광역시: [
        "중구",
        "동구",
        "서구",
        "남구",
        "북구",
        "수성구",
        "달서구",
        "달성군",
      ],
      인천광역시: [
        "중구",
        "동구",
        "미추홀구",
        "연수구",
        "남동구",
        "부평구",
        "계양구",
        "서구",
        "강화군",
        "옹진군",
      ],
      광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
      대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
      울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
      세종특별자치시: ["세종시"],
      경기도: [
        "수원시",
        "성남시",
        "의정부시",
        "안양시",
        "부천시",
        "광명시",
        "평택시",
        "동두천시",
        "안산시",
        "고양시",
        "과천시",
        "구리시",
        "남양주시",
        "오산시",
        "시흥시",
        "군포시",
        "의왕시",
        "하남시",
        "용인시",
        "파주시",
        "이천시",
        "안성시",
        "김포시",
        "화성시",
        "광주시",
        "양주시",
        "포천시",
        "여주시",
        "동두천시",
      ],
      강원도: [
        "춘천시",
        "원주시",
        "강릉시",
        "동해시",
        "태백시",
        "속초시",
        "삼척시",
        "홍천군",
        "횡성군",
        "영월군",
        "평창군",
        "정선군",
        "철원군",
        "화천군",
        "양구군",
        "인제군",
        "고성군",
        "양양군",
      ],
      충청북도: [
        "청주시",
        "충주시",
        "제천시",
        "보은군",
        "옥천군",
        "영동군",
        "증평군",
        "진천군",
        "괴산군",
        "음성군",
        "단양군",
      ],
      충청남도: [
        "천안시",
        "공주시",
        "보령시",
        "아산시",
        "서산시",
        "논산시",
        "계룡시",
        "당진시",
        "금산군",
        "부여군",
        "서천군",
        "청양군",
        "홍성군",
        "예산군",
        "태안군",
      ],
      전라북도: [
        "전주시",
        "군산시",
        "익산시",
        "정읍시",
        "남원시",
        "김제시",
        "완주군",
        "진안군",
        "무주군",
        "장수군",
        "임실군",
        "순창군",
        "고창군",
        "부안군",
      ],
      전라남도: [
        "목포시",
        "여수시",
        "순천시",
        "나주시",
        "광양시",
        "담양군",
        "곡성군",
        "구례군",
        "고흥군",
        "보성군",
        "화순군",
        "장흥군",
        "강진군",
        "해남군",
        "영암군",
        "무안군",
        "함평군",
        "영광군",
        "장성군",
        "완도군",
        "진도군",
        "신안군",
      ],
      경상북도: [
        "포항시",
        "경주시",
        "김천시",
        "안동시",
        "구미시",
        "영주시",
        "영천시",
        "상주시",
        "문경시",
        "경산시",
        "군위군",
        "의성군",
        "청송군",
        "영양군",
        "영덕군",
        "청도군",
        "고령군",
        "성주군",
        "칠곡군",
        "예천군",
        "봉화군",
        "울진군",
        "울릉군",
      ],
      경상남도: [
        "창원시",
        "진주시",
        "통영시",
        "사천시",
        "김해시",
        "밀양시",
        "거제시",
        "양산시",
        "의령군",
        "함안군",
        "창녕군",
        "고성군",
        "남해군",
        "하동군",
        "산청군",
        "함양군",
        "거창군",
        "합천군",
      ],
      제주특별자치도: ["제주시", "서귀포시"],
    },
  };

  // 🌟🌟🌟 1. 컴포넌트 마운트 시 사용자 정보 로드 🌟🌟🌟
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // API 호출: 토큰 기반으로 로그인된 사용자 정보 조회
        const data = await fetchUserInfo();

        // 폼 상태 업데이트
        setForm({
          identification: data.identification || "",
          password: "", // 비밀번호는 보안상 로드하지 않습니다.
          confirmPassword: "",
          name: data.name || "",
          region: data.region || "",
          district: data.district || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          userId: data.id, // 🚨 서버에서 받은 실제 User ID 저장 (수정 시 필요)
        });
        setUserName(data.name || data.identification || "회원");
      } catch (e) {
        console.error("프로필 정보 로드 실패:", e);
        setSubmitError("회원 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userIdFromParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🌟🌟🌟 2. 회원 정보 수정 (PUT API 호출) 🌟🌟🌟
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (form.password && form.password !== form.confirmPassword) {
      setSubmitError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 서버로 보낼 payload 구성
    const payload = {
      name: form.name,
      password: form.password || undefined, // 비어있으면 보내지 않음
      region: form.region,
      district: form.district,
      phoneNumber: form.phoneNumber,
    };

    try {
      // API 호출: form.userId (로그인 시 받은 ID)를 사용하여 수정 요청
      await updatePersonalProfile(form.userId, payload);

      // 성공 피드백
      alert("회원 정보가 성공적으로 수정되었습니다.");

      // 비밀번호 필드 초기화 (보안 유지)
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (e) {
      console.error("회원 정보 수정 실패:", e);
      setSubmitError(`수정 실패: ${e.message || "서버 오류"}`);
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  if (loading) {
    return (
      <div className="profile-container loading-state">
        📡 회원 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="my-page-header">
        <h2>마이페이지</h2>
        <p>사용자 정보 관리 및 각종 기능을 이용하실 수 있습니다.</p>
      </div>
      <div className="my-page-content">
        <MyPageSidebar
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          userName={userName}
        />
        <div className="profile-main-content">
          <h3 className="profile-title">회원 정보 수정</h3>
          <form onSubmit={handleSubmit} className="profile-form">
            {/* 아이디 (identification) - 수정 불가 */}
            <label className="profile-label">아이디</label>
            <input
              type="text"
              name="identification"
              value={form.identification}
              className="profile-input disabled"
              disabled
            />

            {/* 비밀번호 */}
            <label className="profile-label">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="변경 시에만 입력"
              value={form.password}
              onChange={handleChange}
              className="profile-input"
            />
            <label className="profile-label">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="변경 시에만 입력"
              value={form.confirmPassword}
              onChange={handleChange}
              className="profile-input"
            />

            {/* 이름 */}
            <label className="profile-label">이름</label>
            <input
              type="text"
              name="name"
              placeholder="이름 입력"
              value={form.name}
              onChange={handleChange}
              className="profile-input"
            />

            {/* 지역 선택 */}
            <div className="profile-location-wrap">
              <div className="location-item">
                <label className="profile-label">지역 (시)</label>
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className="profile-select"
                >
                  <option value="">시 선택</option>
                  {/* ... (regions.cities map 로직 유지) ... */}
                  {regions.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="location-item">
                <label className="profile-label">지역 (구)</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="profile-select"
                  disabled={!form.region}
                >
                  <option value="">구 선택</option>
                  {/* ... (regions.districts map 로직 유지) ... */}
                  {form.region &&
                    regions.districts[form.region]?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* 이메일 (수정 불가) */}
            <label className="profile-label">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              className="profile-input disabled"
              disabled
            />

            {/* 전화번호 */}
            <label className="profile-label">전화번호</label>
            <input
              type="text"
              name="phoneNumber" // 🚨 name 필드를 phoneNumber로 수정
              value={form.phoneNumber} // 🚨 value 필드도 phoneNumber로 수정
              onChange={handleChange}
              className="profile-input"
            />

            {submitError && (
              <div style={{ color: "#d32f2f", margin: "10px 0" }}>
                {submitError}
              </div>
            )}

            <button type="submit" className="profile-submit-btn">
              회원정보 수정
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
