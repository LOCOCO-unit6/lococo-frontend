import React, { useState } from "react";
import "./PersonalJourney.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPersonalJourney } from "../utils/personalJourneyService";

const PersonalJourney = () => {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    keywords: [],
  });

  const [showResults, setShowResults] = useState(false);
  const [recommendedJourneys, setRecommendedJourneys] = useState([]);

  const keywordOptions = ["음악", "전통", "꽃", "야경", "음식", "예술"];

  /** ✅ 키워드 버튼 토글 */
  const handleCheckboxClick = (value) => {
    setFormData((prev) => {
      const cur = prev.keywords;
      return cur.includes(value)
        ? { ...prev, keywords: cur.filter((v) => v !== value) }
        : { ...prev, keywords: [...cur, value] };
    });
  };

  /** ✅ 날짜 선택 */
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  /** ✅ 커스텀 날짜 버튼 */
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-date-input-btn" onClick={onClick} ref={ref}>
      {value || "날짜를 선택하세요"}
    </button>
  ));

  /** ✅ 검색 실행 */
  const handleSearch = async () => {
    if (formData.keywords.length === 0)
      return alert("키워드를 하나 이상 선택해주세요!");

    try {
      setShowResults(true);
      setRecommendedJourneys([]);

      const data = await fetchPersonalJourney({
        keywords: formData.keywords,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      setRecommendedJourneys(data);
    } catch (err) {
      console.error("❌ fetchPersonalJourney 실패:", err);
      alert("여정 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="journey-container">
      <h2 className="journey-title_1">개인 맞춤 여정</h2>

      <div className="journey-form-box">
        {/* 📅 기간 선택 */}
        <div className="form-group-row">
          <div className="form-group-item">
            <label>기간</label>
            <DatePicker
              selectsRange
              startDate={formData.startDate}
              endDate={formData.endDate}
              onChange={handleDateChange}
              dateFormat="yyyy.MM.dd"
              customInput={<CustomDateInput />}
              isClearable
            />
          </div>
        </div>

        {/* ✅ 관심 키워드 */}
        <div className="form-section">
          <label>관심 키워드</label>
          <div className="checkbox-group">
            {keywordOptions.map((option) => (
              <button
                key={option}
                className={`checkbox-btn ${
                  formData.keywords.includes(option) ? "checked" : ""
                }`}
                onClick={() => handleCheckboxClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="search-button-wrap">
          <button className="search-journey-btn" onClick={handleSearch}>
            여정 찾기
          </button>
        </div>
      </div>

      {/* ✅ 결과 리스트 */}
      {showResults && (
        <div className="journey-results-section">
          {recommendedJourneys.length === 0 ? (
            <p className="no-results">검색 결과를 찾는중입니다</p>
          ) : (
            recommendedJourneys.map((journey) => (
              <div key={journey.id} className="journey-result-card">
                <div className="journey-card-header">
                  {journey.date &&
                    journey.date !== "기간 미정" &&
                    journey.date.trim() !== "" && (
                      <span className="journey-date">{journey.date}</span>
                    )}
                </div>

                <div className="journey-card-body">
                  <div className="journey-image-container">
                    <img
                      src={journey.imageUrl}
                      alt={journey.title}
                      className="journey-card-image"
                      onError={(e) => (e.target.src = "/image/default.png")}
                    />
                  </div>

                  <div className="journey-details">
                    <p className="journey-location">{journey.location}</p>
                    <h4 className="journey-title">{journey.title}</h4>
                    <p className="journey-description">{journey.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalJourney;
