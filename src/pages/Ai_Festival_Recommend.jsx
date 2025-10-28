import React, { useEffect, useState } from "react";
import { fetchFestivals } from "../utils/festivalService";
import "./Ai_Festival_Recommend.css";

export default function AiFestivalRecommend() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const toYMD = (d) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
        d.getDate()
      ).padStart(2, "0")}`;

    // ✅ 현재 연도 전체
    const year = new Date().getFullYear();
    const startYmd = `${year}0101`;
    const endYmd = `${year}1231`;

    console.log("📅 조회 범위:", startYmd, "~", endYmd);

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFestivals({
          startYmd,
          endYmd,
          arrange: "C",
          numOfRows: 50,
        });

        console.log("✅ 불러온 축제 개수:", data.length);
        console.log("✅ 첫 번째 축제:", data[0]);

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="recommend-page-container">
        📡 축제 정보를 불러오는 중…
      </div>
    );
  if (error)
    return (
      <div className="recommend-page-container">
        ⚠️ 축제 정보를 가져오지 못했습니다.
      </div>
    );
  if (!items.length)
    return (
      <div className="recommend-page-container">
        😢 해당 기간에 등록된 축제 정보가 없습니다.
      </div>
    );

  return (
    <div className="recommend-page-container">
      <h2 style={{ marginBottom: "20px" }}>AI 맞춤형 축제 추천</h2>

      <div className="festival-grid">
        {items.map((f) => (
          <div key={f.id} className="festival-card">
            <img
              src={f.image || "/image/default.jpg"}
              alt={f.title}
              className="festival-img"
              onError={(e) => (e.currentTarget.src = "/image/default.jpg")}
            />
            <div className="card-body">
              <h3>{f.title}</h3>
              <p>{f.address || "주소 정보 없음"}</p>
              <p>
                {f.startDate} ~ {f.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
