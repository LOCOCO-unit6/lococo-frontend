// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignUpChoice from "./pages/SignUpChoice.jsx";
import SignUp_General from "./pages/SignUp_General.jsx";

import OrganizerMainPage from "./pages/OrganizerMainPage.jsx";
import OrganizerMyPage from "./pages/OrganizerMyPage.jsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function AppChrome() {
  const { pathname } = useLocation();
  const isOrganizer = pathname.startsWith("/organizer");

  return (
    <div className="App">
      <ScrollToTop />

      <Header mode={isOrganizer ? "organizer" : "default"} />

      <div className="content-wrap">
        <Routes>
          {/* 일반 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-choice" element={<SignUpChoice />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup_general" element={<SignUp_General />} />

          {/* 주최자 */}
          <Route path="/organizer" element={<OrganizerMainPage />} />
          <Route path="/organizer/mypage" element={<OrganizerMyPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppChrome />
    </BrowserRouter>
  );
}
