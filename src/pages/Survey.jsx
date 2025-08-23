import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Survey.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt, FaTimes } from "react-icons/fa";

const Survey = () => {
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
      부산광역시: [
        "중구",
        "서구",
        "동구",
        "영도구",
        "부산진구",
        "동래구",
        "남구",
        "북구",
        "해운대구",
        "사하구",
        "금정구",
        "강서구",
        "연제구",
        "수영구",
        "사상구",
        "기장군",
      ],
      대구광역시: [
        "중구",
        "동구",
        "서구",
        "남구",
        "북구",
        "수성구",
        "달서구",
        "달성군",
      ],
      인천광역시: [
        "중구",
        "동구",
        "미추홀구",
        "연수구",
        "남동구",
        "부평구",
        "계양구",
        "서구",
        "강화군",
        "옹진군",
      ],
      광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
      대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
      울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
      세종특별자치시: ["세종시"],
      경기도: [
        "수원시",
        "성남시",
        "의정부시",
        "안양시",
        "부천시",
        "광명시",
        "평택시",
        "동두천시",
        "안산시",
        "고양시",
        "과천시",
        "구리시",
        "남양주시",
        "오산시",
        "시흥시",
        "군포시",
        "의왕시",
        "하남시",
        "용인시",
        "파주시",
        "이천시",
        "안성시",
        "김포시",
        "화성시",
        "광주시",
        "양주시",
        "포천시",
        "여주시",
        "동두천시",
      ],
      강원도: [
        "춘천시",
        "원주시",
        "강릉시",
        "동해시",
        "태백시",
        "속초시",
        "삼척시",
        "홍천군",
        "횡성군",
        "영월군",
        "평창군",
        "정선군",
        "철원군",
        "화천군",
        "양구군",
        "인제군",
        "고성군",
        "양양군",
      ],
      충청북도: [
        "청주시",
        "충주시",
        "제천시",
        "보은군",
        "옥천군",
        "영동군",
        "증평군",
        "진천군",
        "괴산군",
        "음성군",
        "단양군",
      ],
      충청남도: [
        "천안시",
        "공주시",
        "보령시",
        "아산시",
        "서산시",
        "논산시",
        "계룡시",
        "당진시",
        "금산군",
        "부여군",
        "서천군",
        "청양군",
        "홍성군",
        "예산군",
        "태안군",
      ],
      전라북도: [
        "전주시",
        "군산시",
        "익산시",
        "정읍시",
        "남원시",
        "김제시",
        "완주군",
        "진안군",
        "무주군",
        "장수군",
        "임실군",
        "순창군",
        "고창군",
        "부안군",
      ],
      전라남도: [
        "목포시",
        "여수시",
        "순천시",
        "나주시",
        "광양시",
        "담양군",
        "곡성군",
        "구례군",
        "고흥군",
        "보성군",
        "화순군",
        "장흥군",
        "강진군",
        "해남군",
        "영암군",
        "무안군",
        "함평군",
        "영광군",
        "장성군",
        "완도군",
        "진도군",
        "신안군",
      ],
      경상북도: [
        "포항시",
        "경주시",
        "김천시",
        "안동시",
        "구미시",
        "영주시",
        "영천시",
        "상주시",
        "문경시",
        "경산시",
        "군위군",
        "의성군",
        "청송군",
        "영양군",
        "영덕군",
        "청도군",
        "고령군",
        "성주군",
        "칠곡군",
        "예천군",
        "봉화군",
        "울진군",
        "울릉군",
      ],
      경상남도: [
        "창원시",
        "진주시",
        "통영시",
        "사천시",
        "김해시",
        "밀양시",
        "거제시",
        "양산시",
        "의령군",
        "함안군",
        "창녕군",
        "고성군",
        "남해군",
        "하동군",
        "산청군",
        "함양군",
        "거창군",
        "합천군",
      ],
      제주특별자치도: ["제주시", "서귀포시"],
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
    filters: [],
    travelStyles: [],
  });

  const [photos, setPhotos] = useState([]);

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
  const filterOptions = ["무료만", "실내만"];
  const travelStyleOptions = ["축제형", "계획형"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
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

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (photoToRemoveUrl) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.url !== photoToRemoveUrl)
    );
    URL.revokeObjectURL(photoToRemoveUrl);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-date-input-btn" onClick={onClick} ref={ref}>
      {value || "날짜를 선택하세요"}
      <FaRegCalendarAlt className="calendar-svg-icon" />
    </button>
  ));

  const handleSubmit = () => {
    console.log("선택된 설문조사 데이터:", formData);
  };

  return (
    <div className="survey-page-container">
      <div className="survey-header">
        <h2 className="survey-title">설문조사</h2>
        <p className="survey-subtitle">
          입력해 주신 정보를 바탕으로 맞춤형 축제와 여정을 안내해 드립니다
        </p>
      </div>

      <div className="survey-form-box">
        <div className="survey-section form-group-row">
          <div className="form-group-item">
            <label className="input-label">기간</label>
            <DatePicker
              selectsRange={true}
              startDate={formData.startDate}
              endDate={formData.endDate}
              onChange={handleDateChange}
              dateFormat="yyyy.MM.dd"
              customInput={<CustomInput />}
              isClearable={true}
            />
          </div>
          <div className="form-group-item">
            <label className="input-label">장소 (시)</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="select-input"
            >
              <option value="">시 선택</option>
              {regions.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-item">
            <label className="input-label">장소 (구)</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              disabled={!formData.city}
              className="select-input"
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

        <div className="survey-section">
          <label className="input-label">관심 키워드</label>
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

        <div className="survey-section">
          <label className="input-label">연령</label>
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

        <div className="survey-section companion-filter-section">
          <div className="companion-group">
            <label className="input-label">동반자 유형</label>
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
          <div className="filter-group">
            <label className="input-label">필터</label>
            <div className="checkbox-group">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  className={`checkbox-btn ${
                    formData.filters.includes(option) ? "checked" : ""
                  }`}
                  onClick={() => handleCheckboxClick("filters", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="survey-section style-budget-section">
          <div className="travel-style-group">
            <label className="input-label">여행 스타일</label>
            <div className="checkbox-group">
              {travelStyleOptions.map((option) => (
                <button
                  key={option}
                  className={`checkbox-btn ${
                    formData.travelStyles.includes(option) ? "checked" : ""
                  }`}
                  onClick={() => handleCheckboxClick("travelStyles", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="budget-group">
            <label className="input-label">하루 예산 범위</label>
            <div className="budget-input-wrap">
              <input
                type="text"
                className="budget-input"
                placeholder="숫자 입력"
              />
              <span>원</span>
            </div>
          </div>
        </div>

        <div className="survey-section record-section">
          <label className="input-label">참여한 축제/여정 기록</label>
          <div className="record-input-group">
            <div className="select-wrap">
              <select name="record" className="record-select-input">
                <option value="">기록 불러오기</option>
                <option value="record1">2023년 제주도 여행</option>
                <option value="record2">2024년 서울 축제</option>
              </select>
            </div>
            <input
              type="text"
              className="record-custom-input"
              placeholder="직접 입력"
            />
            <button className="record-add-btn">입력</button>
          </div>
        </div>

        <div className="survey-section photo-upload-section">
          <label className="input-label">
            사진 첨부<span className="optional">(선택)</span>
            <p className="photo-info-text">
              사진 분석을 바탕으로 AI가 맞춤 추천을 해드립니다
            </p>
          </label>

          <div className="photo-upload-btn-wrap">
            <label htmlFor="photo-upload-input" className="photo-upload-btn">
              사진 첨부
            </label>
            <input
              type="file"
              id="photo-upload-input"
              multiple
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="photo-preview-container">
            {photos.map((photo, index) => (
              <div key={index} className="photo-preview-wrap">
                <img
                  src={photo.url}
                  alt={`preview-${index}`}
                  className="photo-preview-img"
                />
                <button
                  className="remove-photo-btn"
                  onClick={() => handleRemovePhoto(photo.url)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="submit-btn-sections">
          <Link to="/AiFestivalRecommend">
            <button className="submit-btns">추천 받기</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Survey;
