import React, { useState } from "react";
import "./SignUp_General.css";
import { registerGeneral } from "../utils/Api.js"; // 방금 만든 API 함수를 가져옵니다.

const GeneralSignUp = () => {
  const [form, setForm] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    region: "",
    district: "",
    email: "",
    emailCode: "",
    phone: "",
  });

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
      ],
      대구광역시: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구"],
      인천광역시: [
        "중구",
        "동구",
        "미추홀구",
        "연수구",
        "남동구",
        "부평구",
        "계양구",
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
      ],
      강원도: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시"],
      충청북도: ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군"],
      충청남도: ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시"],
      전라북도: ["전주시", "군산시", "익산시", "정읍시", "남원시"],
      전라남도: ["목포시", "여수시", "순천시", "나주시", "광양시"],
      경상북도: ["포항시", "경주시", "김천시", "안동시", "구미시"],
      경상남도: ["창원시", "진주시", "통영시", "사천시", "김해시"],
      제주특별자치도: ["제주시", "서귀포시"],
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, district: "" }));
  };

  const handleEmailAuth = () => {
    alert("인증요청이 전송되었습니다.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호와 비밀번호 확인이 일치하는지 먼저 검증합니다.
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 명세서에 맞는 데이터 형태로 변환
    const formData = {
      identification: form.id,
      password: form.password,
      email: form.email,
      phoneNumber: form.phone,
      affiliation: form.region, // 지역 정보를 affiliation으로 매핑
      role: "general", // 역할은 'general'로 고정
      passwordCheck: form.confirmPassword,
    };

    try {
      const response = await registerGeneral(formData); // API 호출
      console.log("회원가입 성공:", response);
      alert("회원가입에 성공했습니다!");
      // 성공 후 다음 페이지로 이동하거나, 로그인 상태를 변경하는 등의 로직을 추가할 수 있습니다.
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert(`회원가입에 실패했습니다: ${error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <h2>일반 가입</h2>
      <p className="subtitle">관광 및 축제 추천을 원하는 일반 이용자</p>

      <form onSubmit={handleSubmit} className="signup-form">
        <label>아이디</label>
        <input
          type="text"
          name="id"
          placeholder="4~20자리 / 영문 및 숫자 포함"
          value={form.id}
          onChange={handleChange}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          placeholder="8~20자리 / 영문, 숫자, 특수문자 포함"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="8~20자리 / 영문, 숫자, 특수문자 포함"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <label>이름</label>
        <input
          type="text"
          name="name"
          placeholder="이름 입력"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>장소 (시)</label>
        <select
          name="region"
          value={form.region}
          onChange={handleCityChange}
          required
        >
          <option value="">시 선택</option>
          {regions.cities.map((r, idx) => (
            <option key={idx} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label>장소 (구)</label>
        <select
          name="district"
          value={form.district}
          onChange={handleChange}
          disabled={!form.region}
          required
        >
          <option value="">구 선택</option>
          {form.region &&
            regions.districts[form.region]?.map((d, idx) => (
              <option key={idx} value={d}>
                {d}
              </option>
            ))}
        </select>

        <label>이메일</label>
        <div className="email-section">
          <input
            type="email"
            name="email"
            placeholder="email@lococo.co.kr"
            value={form.email}
            onChange={handleChange}
            required
          />
          <button type="button" className="auth-btn" onClick={handleEmailAuth}>
            인증요청
          </button>
        </div>

        <label>이메일 인증</label>
        <input
          type="text"
          name="emailCode"
          placeholder="인증번호 입력"
          value={form.emailCode}
          onChange={handleChange}
        />

        <label>전화번호</label>
        <input
          type="text"
          name="phone"
          placeholder="숫자 입력"
          value={form.phone}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default GeneralSignUp;
