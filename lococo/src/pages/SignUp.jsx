import React from "react";
import "./SignUp.css";

function SignUp() {
  return (
    <main className="signup-container">
      <h2>기획/주최 가입</h2>
      <p className="subtitle">축제 기획 및 주최를 계획하는 운영진</p>

      <form className="signup-form">
        <label>아이디</label>
        <input type="text" placeholder="4~20자리 / 영문 및 숫자 포함" />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="8~20자리 / 영문, 숫자, 특수문자 포함"
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="8~20자리 / 영문, 숫자, 특수문자 포함"
        />

        <label>이메일</label>
        <input
          type="email"
          placeholder="email@lococo.co.kr"
          className="email-input"
        />
        <button type="button" className="verify-button">
          인증요청
        </button>

        <label>이메일 인증</label>
        <input type="text" placeholder="인증번호 입력" />

        <label>전화번호</label>
        <input type="tel" placeholder="숫자 입력" />

        <label>소속기관명</label>
        <input type="text" placeholder="기관명 입력" />

        <button type="submit" className="submit-btn">
          회원가입
        </button>
      </form>
    </main>
  );
}

export default SignUp;
