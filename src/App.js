import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignUpChoice from "./pages/SignUpChoice.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<div>메인 페이지입니다.</div>} />
            <Route path="/signup-choice" element={<SignUpChoice />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
