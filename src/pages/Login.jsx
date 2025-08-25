// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../image/Logo.png";
import "./Login.css";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://3.39.0.20:8080";

const saveToken = (token) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("token", token);
  Cookies.set("token", token, { expires: 7 });
  try {
    window.dispatchEvent(new Event("storage"));
  } catch {}
};

export default function Login() {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState("personal"); // personal | company
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    const endpoint =
      roleTab === "company"
        ? "/api/v1/admin/login" // 기업회원 전용
        : "/api/v1/user/login"; // 개인회원 전용

    try {
      const res = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        {
          identification: String(id || "").trim(),
          password: String(pw || "").trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res?.data || {};
      const token = data?.token || data?.accessToken || "";
      const role = data?.user?.role || data?.role || ""; // 백엔드가 어떤 키로 주든 대응

      // ✅ 포털-역할 일치 검사 (개인 → personal, 기업 → company/admin)
      const isCompanyRole = /^(company|admin)$/i.test(role);
      const isPersonalRole =
        /^(personal|user|member)$/i.test(role) || role === ""; // role 안주는 경우도 있음

      if (roleTab === "company" && !isCompanyRole) {
        setError(
          "기업회원 전용 로그인입니다. 개인회원은 개인 로그인 창을 이용하세요."
        );
        return;
      }
      if (roleTab === "personal" && isCompanyRole) {
        setError(
          "개인회원 전용 로그인입니다. 기업/관리자 계정은 기업 로그인 창을 이용하세요."
        );
        return;
      }
      if (!token) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      // 저장 & 이동
      saveToken(token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      navigate(roleTab === "company" ? "/organizer" : "/");
    } catch (err) {
      const status = err?.response?.status;
      const raw =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "";
      const looksLikeNPE = /NullPointer|user.*null|getIdentification/i.test(
        String(raw)
      );

      if (status === 400 || status === 401 || status === 404 || looksLikeNPE) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="logo-wrap">
        <img src={Logo} alt="LOCOCO" className="login-logo" />
      </div>

      <h2 className="login-title">로그인</h2>

      {/* 개인/기업 UI 분리 탭 */}
      <div className="role-switch" role="tablist" aria-label="로그인 유형 선택">
        <button
          type="button"
          className={`role-tab ${roleTab === "personal" ? "active" : ""}`}
          onClick={() => setRoleTab("personal")}
          role="tab"
          aria-selected={roleTab === "personal"}
        >
          개인회원
        </button>
        <button
          type="button"
          className={`role-tab ${roleTab === "company" ? "active" : ""}`}
          onClick={() => setRoleTab("company")}
          role="tab"
          aria-selected={roleTab === "company"}
        >
          기업회원
        </button>
        <span className={`role-underline ${roleTab}`} />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디(identification)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <div style={{ color: "#d32f2f", fontSize: 14, marginTop: 6 }}>
            {error}
          </div>
        )}

        <button type="submit" className="login-btn" disabled={busy}>
          {busy
            ? "로그인 중..."
            : roleTab === "company"
            ? "기업 로그인"
            : "개인 로그인"}
        </button>
      </form>

      <p
        className="signup-link"
        onClick={() => navigate("/signup-choice")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate("/signup-choice")}
      >
        회원가입 하기
      </p>
    </div>
  );
}
