import React, { useState } from "react";
import "./PersonalJourney.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const PersonalJourney = () => {
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
        "노원구",
        "은평구",
        "서대문구",
        "마포구",
        "양천구",
        "강서구",
        "구로구",
        "금천구",
        "영등포구",
        "동작구",
        "관악구",
        "서초구",
        "강남구",
        "송파구",
        "강동구",
      ],
      // ... (other districts)
    },
  };

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    city: "",
    district: "",
    keywords: [],
    age: [],
    companion: [],
    time: [],
  });

  const [showResults, setShowResults] = useState(false);
  const [expandedJourneys, setExpandedJourneys] = useState({});

  const keywordOptions = [
    "음식",
    "전통",
    "음악",
    "야경",
    "불꽃놀이",
    "꽃",
    "예술",
  ];
  const ageOptions = [
    "10대 미만",
    "10대",
    "20대~30대",
    "40대~50대",
    "60대 이상",
  ];
  const companionOptions = ["나홀로", "가족", "연인", "친구"];
  const timeOptions = ["오전", "오후", "상관없음"];

  const recommendedJourneys = [
    {
      id: 1,
      date: "2025-08-07",
      location: "서울특별시 강남구",
      title: "강남 가족 투어",
      description:
        "가족과 함께 즐기기 좋은 행궁동의 골목 여행 스팟 축제 추천 아아아아아아아아아아아아",
      imageUrl: "/image/journey1.png",
      timeline: [
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
        { time: "10:30", text: "예술의 전당 한가람 미술관" },
      ],
    },
    {
      id: 2,
      date: "2025-08-07",
      location: "경기도 수원시",
      title: "행궁동 골목여행",
      description:
        "가족과 함께 즐기기 좋은 행궁동의 골목 여행 스팟 축제 추천 아아아아아아아아아아아아",
      imageUrl: "/image/journey2.png",
      timeline: [
        { time: "10:30", text: "수원화성 방화수류정" },
        { time: "12:00", text: "행리단길 맛집 탐방" },
        { time: "14:30", text: "행궁동 벽화마을 산책" },
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxClick = (category, value) => {
    setFormData((prev) => {
      const currentArray = prev[category];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [category]: currentArray.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [category]: [...currentArray, value] };
      }
    });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
  };

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-date-input-btn" onClick={onClick} ref={ref}>
      {value || "날짜를 선택하세요"}
    </button>
  ));

  const handleSearch = () => {
    setShowResults(true);
    console.log("여정 찾기 시작:", formData);
  };

  const handleToggleExpand = (id) => {
    setExpandedJourneys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="journey-container">
      <h2 className="journey-title_1">개인 맞춤 여정</h2>
      <div className="journey-form-box">
        <div className="form-group-row">
          <div className="form-group-item">
            <label>기간</label>
            <div className="date-input-wrap">
              <DatePicker
                selectsRange={true}
                startDate={formData.startDate}
                endDate={formData.endDate}
                onChange={handleDateChange}
                dateFormat="yyyy.MM.dd"
                customInput={<CustomDateInput />}
                isClearable={true}
              />
            </div>
          </div>
          <div className="form-group-item">
            <label>장소 (시)</label>
            <div className="select-wrap">
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              >
                <option value="">시 선택</option>
                {regions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group-item">
            <label>장소 (구)</label>
            <div className="select-wrap">
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                disabled={!formData.city}
              >
                <option value="">구 선택</option>
                {formData.city &&
                  regions.districts[formData.city]?.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <label>관심 키워드</label>
          <div className="checkbox-group">
            {keywordOptions.map((option) => (
              <button
                key={option}
                className={`checkbox-btn ${
                  formData.keywords.includes(option) ? "checked" : ""
                }`}
                onClick={() => handleCheckboxClick("keywords", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>연령</label>
          <div className="checkbox-group">
            {ageOptions.map((option) => (
              <button
                key={option}
                className={`checkbox-btn ${
                  formData.age.includes(option) ? "checked" : ""
                }`}
                onClick={() => handleCheckboxClick("age", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>동반자 유형</label>
          <div className="checkbox-group">
            {companionOptions.map((option) => (
              <button
                key={option}
                className={`checkbox-btn ${
                  formData.companion.includes(option) ? "checked" : ""
                }`}
                onClick={() => handleCheckboxClick("companion", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>시간대</label>
          <div className="checkbox-group">
            {timeOptions.map((option) => (
              <button
                key={option}
                className={`checkbox-btn ${
                  formData.time.includes(option) ? "checked" : ""
                }`}
                onClick={() => handleCheckboxClick("time", option)}
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

      {showResults && (
        <div className="journey-results-section">
          {recommendedJourneys.map((journey) => (
            <div key={journey.id} className="journey-result-card">
              <div className="journey-card-header">
                <span className="journey-date">{journey.date}</span>
              </div>
              <div className="journey-card-body">
                <div className="journey-image-container">
                  <img
                    src={journey.imageUrl}
                    alt={journey.title}
                    className="journey-card-image"
                  />
                </div>
                <div className="journey-details">
                  <p className="journey-location">{journey.location}</p>
                  <h4 className="journey-title">{journey.title}</h4>
                  <p className="journey-description">{journey.description}</p>
                </div>
                <button
                  className="expand-btn"
                  onClick={() => handleToggleExpand(journey.id)}
                >
                  {expandedJourneys[journey.id] ? (
                    <>
                      접기 <FaChevronUp />
                    </>
                  ) : (
                    <>
                      펼치기 <FaChevronDown />
                    </>
                  )}
                </button>
              </div>
              {expandedJourneys[journey.id] && (
                <div className="course-timeline-sectionsv1">
                  {journey.timeline.map((item, index) => (
                    <div key={index} className="timeline-itemsv1">
                      <span className="timeline-dot1" />
                      <span className="timeline-text1">
                        {item.time} {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalJourney;
