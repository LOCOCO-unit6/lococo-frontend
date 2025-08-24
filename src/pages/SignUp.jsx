// src/pages/SignUp.jsx
import React, { useState } from "react";
import "./SignUp.css";
import {
  registerOrganizer,
  requestEmailVerification,
  confirmEmailVerification,
} from "../utils/Api";

export default function SignUp() {
  const [form, setForm] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    phone: "",
    affiliation: "", // 기관/회사명
  });
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const sendCode = async () => {
    if (!form.email) return alert("이메일을 입력해 주세요.");
    try {
      await requestEmailVerification(form.email);
      setSent(true);
      alert("인증 메일을 전송했습니다.");
    } catch (e) {
      alert(`인증요청 실패: ${e.message || "오류"}`);
    }
  };

  const verifyCode = async () => {
    if (!form.emailCode) return alert("인증번호를 입력해 주세요.");
    try {
      await confirmEmailVerification(form.email, form.emailCode);
      setVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!verified) return alert("이메일 인증을 완료해 주세요.");

    const payload = {
      identification: form.id,
      password: form.password,
      passwordCheck: form.confirmPassword,
      email: form.email,
      phoneNumber: form.phone,
      affiliation: form.affiliation,
    };

    try {
      await registerOrganizer(payload); // role=ADMIN
      alert("기업(주최자) 회원가입이 완료되었습니다!");
    } catch (e) {
      alert(`회원가입 실패: ${e.message || "오류"}`);
    }
  };

  return (
    <main className="signup-container">
      <h2>기획/주최 가입</h2>
      <p className="subtitle">축제 기획 및 주최를 계획하는 운영진</p>

      <form className="signup-form" onSubmit={onSubmit}>
        <label>아이디</label>
        <input name="id" value={form.id} onChange={onChange} required />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          required
        />

        <label>이메일</label>
        <div className="email-input-row">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            disabled={sent}
            required
          />
          <button type="button" className="verify-button" onClick={sendCode}>
            인증요청
          </button>
        </div>

        <label>이메일 인증</label>
        <div className="email-input-row">
          <input
            name="emailCode"
            value={form.emailCode}
            onChange={onChange}
            disabled={verified}
            required
          />
          <button
            type="button"
            className="verify-button"
            onClick={verifyCode}
            disabled={!sent || verified}
          >
            인증번호 확인
          </button>
        </div>

        <label>전화번호</label>
        <input name="phone" value={form.phone} onChange={onChange} />

        <label>소속기관명</label>
        <input
          name="affiliation"
          value={form.affiliation}
          onChange={onChange}
          required
        />

        <button type="submit" className="submit-btn">
          회원가입
        </button>
      </form>
    </main>
  );
}
