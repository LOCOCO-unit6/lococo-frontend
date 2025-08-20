import React, { useState } from "react";
import "./Service_Guide.css";

import image_1 from "../image/image_1.png";
import image_2 from "../image/image_2.png";
import image_3 from "../image/image_3.png";

const Service_Guide = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "AI 맞춤 여행 코스를 추천받으려면 회원가입이 필요한가요?",
      answer:
        "네, AI 맞춤 여행 코스는 사용자 정보를 기반으로 맞춤형 엔드투엔드 여행 코스를 추천해 드리기 때문에 회원가입 후에 추천을 받으실 수 있습니다. 단, 메인 페이지의 ‘추천 코스’는 비회원 분들도 이용 가능하오니 참고 부탁드립니다.",
    },
    {
      id: 2,
      question: "추천받은 코스를 저장할 수 있나요?",
      answer:
        "추천받은 코스를 나의 여정으로 추가하면 마이페이지의 '나의 여정 관리'에서 확인해 볼 수 있습니다. ",
    },
    {
      id: 3,
      question: "여행 추천에 숙박·교통 정보도 포함되나요?",
      answer:
        "숙박 정보는 제공하지만 교통 정보는 아직 지원하지 않고 있습니다. 현재는 추천된 축제와 관련된 정보만 제공하고 있습니다. 추후 교통 정보도 포함될 예정입니다.",
    },
    {
      id: 4,
      question: "전통시장이 일정에 꼭 포함되는 건가요? 선택 가능한가요?",
      answer:
        "사용자 데이터를 기반으로 AI가 맞춤 추천하는 일정이기 때문에 사용자가 전통시장이 포함된 여정을 어떻게 평가하느냐에 따라 포함 여부가 달라질 수 있습니다.",
    },
    {
      id: 5,
      question: "AI 추천이 무료인가요? 유료 기능은 어떤 게 있나요?",
      answer:
        "네. AI 추천은 무료 입니다. 뿐만 아니라 로코코는 일반 이용자(여행객)의 모든 기능을 무료로 제공하고 있습니다.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="service-guide-wrapper">
      {/* 타이틀 */}
      <h2 className="service-title">서비스 안내</h2>

      {/* 세션 영역 */}
      {/*AI 맞춤형 축제 추천_1 */}
      <div className="service-section">
        <div className="service-text">
          <h4 className="service-label">AI맞춤형축제추천</h4>
          <h3 className="service-heading">
            숨어있는 지역 축제가 이렇게나 많이? <br />
            AI가 당신에게 딱 맞는 축제를 추천해 드려요
          </h3>
          <p className="service-description">
            기본적인 정보만 입력하면 AI가 사용자 데이터를 분석하여 맞춤형 축제를
            추천해 드려요. <br />
            선호도 데이터가 쌓일수록 더 정확한 AI 추천이 가능합니다.
          </p>
        </div>
        <img src={image_1} alt="AI맞춤형축제추천" className="service-image" />
      </div>

      {/* 개인맞춤여정 섹션_2 */}
      <div className="alt-wrapper">
        <div className="service-section alt">
          <img src={image_2} alt="개인맞춤여정" className="service-image" />
          <div className="service-text">
            <h4 className="service-label">개인맞춤여정</h4>
            <h3 className="service-heading">
              바쁘다 바쁜 현대인들을 위해 <br />
              여행 일정까지 전부 준비해 드립니다
            </h3>
            <p className="service-description">
              시간이 부족한 현대인들을 위해 맞춤 코스로 여행 일정을 짜 드려요.
              <br />
              AI 맞춤형 축제의 추천 결과를 포함하여 더욱 밀도 있는 여정을 준비해
              드립니다.
            </p>
          </div>
        </div>
      </div>
      {/* 마이페이지_3 */}
      <div className="service-section">
        <div className="service-text">
          <h4 className="service-label">마이페이지</h4>
          <h3 className="service-heading">
            관심있는 콘텐츠들과 후기는 <br />
            마이페이지에서 관리해 보세요!
          </h3>
          <p className="service-description">
            관심 있어 한 축제나 여정이 있으신가요? <br />
            마이페이지에서 한 눈에 확인해 보세요. 후기도 남길 수 있습니다.
          </p>
        </div>
        <img src={image_3} alt="마이페이지" className="service-image" />
      </div>

      <hr className="divider-line" />

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="faq-title">FAQ</h2>
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">{faq.question}</div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service_Guide;
