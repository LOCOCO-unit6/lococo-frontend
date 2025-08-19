import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import MainPage from "./pages/MainPage.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignUpChoice from "./pages/SignUpChoice.jsx";
import SignUp_General from "./pages/SignUp_General.jsx";
import Ai_Festival_Recommend from "./pages/Ai_Festival_Recommend.jsx";
import FestivalDetail from "./pages/FestivalDetail.jsx";
import PersonalJourney from "./pages/PersonalJourney.jsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ScrollToTop />
        <Header />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup-choice" element={<SignUpChoice />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup_general" element={<SignUp_General />} />
            <Route
              path="/AiFestivalRecommend"
              element={<Ai_Festival_Recommend />}
            />
            <Route path="/festival/:id" element={<FestivalDetail />} />
            <Route path="/personal-journey" element={<PersonalJourney />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
