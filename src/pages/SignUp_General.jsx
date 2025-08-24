import React, { useState } from "react";
import "./SignUp_General.css";
import {
  registerGeneral,
  requestEmailVerification,
  confirmEmailVerification,
} from "../utils/Api.js"; // API 함수를 import합니다.

const GeneralSignUp = () => {
  const [form, setForm] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    region: "",
    email: "",
    emailCode: "",
    phone: "",
  });

  const regions = [
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
  ];
  // 상태와 핸들러를 추가하여 이메일 인증 기능 구현
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailAuth = async () => {
    if (!form.email) {
      alert("이메일 주소를 입력해 주세요.");
      return;
    }
    try {
      console.log(form.email);
      await requestEmailVerification(form.email);
      setIsEmailSent(true);
      alert("인증 메일이 전송되었습니다. 이메일을 확인해 주세요.");
    } catch (error) {
      console.error("인증요청 실패:", error);
      alert(`인증요청에 실패했습니다: ${error.message}`);
    }
  };

  const handleEmailConfirm = async () => {
    if (!form.emailCode) {
      alert("인증번호를 입력해 주세요.");
      return;
    }
    try {
      await confirmEmailVerification(form.email, form.emailCode);
      setIsEmailVerified(true);
      alert("인증이 완료되었습니다!");
    } catch (error) {
      console.error("인증번호 확인 실패:", error);
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해 주세요.");
      return;
    }

    const formData = {
      identification: form.id,
      password: form.password,
      email: form.email,
      phoneNumber: form.phone,
      affiliation: form.region,
      role: "USER",
      passwordCheck: form.confirmPassword,
    };

    try {
      const response = await registerGeneral(formData);
      console.log("회원가입 성공:", response);
      alert("회원가입에 성공했습니다!");
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
          placeholder="성 이름 입력"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>지역</label>
        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          required
        >
          <option value="">거주 지역을 선택해 주세요</option>
          {regions.map((r, idx) => (
            <option key={idx} value={r}>
              {r}
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
            disabled={isEmailSent}
          />
          <button type="button" className="auth-btn" onClick={handleEmailAuth}>
            인증요청
          </button>
        </div>

        <label>이메일 인증</label>
        <div className="email-confirm-section">
          <input
            type="text"
            name="emailCode"
            placeholder="인증번호 입력"
            value={form.emailCode}
            onChange={handleChange}
            disabled={isEmailVerified}
          />
          <button
            type="button"
            className="confirm-Button"
            onClick={handleEmailConfirm}
            disabled={!isEmailSent || isEmailVerified}
          >
            인증번호 확인
          </button>
        </div>

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
