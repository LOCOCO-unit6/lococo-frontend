// src/App.js
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Survey from "./pages/Survey.jsx";
import MainPage from "./pages/MainPage.jsx";
import RecommendedCourseDetail from "./pages/RecommendedCourseDetail.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignUpChoice from "./pages/SignUpChoice.jsx";
import SignUp_General from "./pages/SignUp_General.jsx";
import AiFestivalRecommend from "./pages/Ai_Festival_Recommend.jsx";
import FestivalDetail from "./pages/FestivalDetail.jsx";
import PersonalJourney from "./pages/PersonalJourney.jsx";
import ServiceGuide from "./pages/Service_Guide.jsx";
import MyPage from "./pages/MyPage.jsx";
import MyPage_My_Journey_Management from "./pages/MyPage_My_Journey_Management.jsx";
import MyPage_Review_Write from "./pages/MyPage_Review_Write.jsx";
import MyPage_Review_Management from "./pages/MyPage_Review_Management.jsx";
import AI_Customized_Festival_Recommendation_NL from "./components/AI_Customized_Festival_Recommendation_NL.jsx";
import AI_Customized_Festival_Recommendation_NS from "./components/AI_Customized_Festival_Recommendation_NS.jsx";
import Personalized_Survey_NA from "./components/Personalized_Survey_NA.jsx";
import PersonalJourney_Result from "./pages/PersonalJourney_Result.jsx";

import OrganizerMainPage from "./pages/OrganizerMainPage.jsx";
import OrganizerMyPage from "./pages/OrganizerMyPage.jsx";
import OrganizerReviewDetail from "./pages/OrganizerReviewDetail.jsx";
import OrganizerContentDetail from "./pages/OrganizerContentDetail.jsx";
import AiPlanner from "./pages/AiPlanner.jsx";
import AiPromoStart from "./pages/AiPromoStart.jsx";
import AiPromoForm from "./pages/AiPromoForm.jsx";
import AiPromoLoading from "./pages/AiPromoLoading.jsx";
import AiPromoResults from "./pages/AiPromoResults.jsx";
import AiPromoEditor from "./pages/AiPromoEditor.jsx";
import ContentCreate from "./pages/ContentCreate.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function AppChrome() {
  const { pathname } = useLocation();

  return (
    <div className="App">
      <ScrollToTop />

      <Header
        mode={pathname.startsWith("/organizer") ? "organizer" : "default"}
      />

      <div className="content-wrap">
        <Routes>
          {/* 일반 */}
          <Route path="/" element={<MainPage />} />
          <Route
            path="/recommended-course/:id"
            element={<RecommendedCourseDetail />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-choice" element={<SignUpChoice />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup_general" element={<SignUp_General />} />
          <Route
            path="/AiFestivalRecommend"
            element={<AiFestivalRecommend />}
          />
          <Route path="/festival/:id" element={<FestivalDetail />} />
          <Route path="/PersonalJourney" element={<PersonalJourney />} />
          <Route path="/Service_Guide" element={<ServiceGuide />} />
          <Route path="/MyPage/liked-contents" element={<MyPage />} />
          <Route
            path="/MyPage_My_Journey_Management"
            element={<MyPage_My_Journey_Management />}
          />
          <Route path="/review-write" element={<MyPage_Review_Write />} />
          <Route
            path="/MyPage/reviews"
            element={<MyPage_Review_Management />}
          />
          <Route
            path="PersonalJourney_Result"
            element={<PersonalJourney_Result />}
          />

          {/* 설문조사 */}
          <Route path="/survey" element={<Survey />} />

          {/*Ai맞춤형 축제 추천, 개인 맞춤 여정(미로그인시/ 회원시)*/}
          <Route
            path="/ai-recommendation-nl"
            element={<AI_Customized_Festival_Recommendation_NL />}
          />
          <Route
            path="/ai-recommendation-ns"
            element={<AI_Customized_Festival_Recommendation_NS />}
          />
          <Route
            path="/personalized-survey-na"
            element={<Personalized_Survey_NA />}
          />

          {/* Redirects */}
          <Route path="/Login" element={<Navigate to="/login" replace />} />

          {/* 주최자 */}
          <Route path="/organizer" element={<OrganizerMainPage />} />
          <Route path="/organizer/mypage" element={<OrganizerMyPage />} />
          {/* 주최자 상세 페이지 */}
          <Route
            path="/organizer/mypage/review/:id"
            element={<OrganizerReviewDetail />}
          />
          <Route
            path="/organizer/mypage/content/:id"
            element={<OrganizerContentDetail />}
          />
          <Route path="/organizer/ai" element={<AiPlanner />} />
          <Route path="/organizer/ai-promo" element={<AiPromoStart />} />
          <Route path="/organizer/ai-promo/form" element={<AiPromoForm />} />
          <Route
            path="/organizer/ai-promo/loading"
            element={<AiPromoLoading />}
          />
          <Route
            path="/organizer/ai-promo/results"
            element={<AiPromoResults />}
          />
          <Route
            path="/organizer/ai-promo/editor"
            element={<AiPromoEditor />}
          />
          <Route path="/organizer/content/create" element={<ContentCreate />} />
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
