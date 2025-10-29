import axios from "axios";

const BASE_URL = "/tourapi";
const SERVICE_KEY = process.env.REACT_APP_TOURAPI_KEY;

/**
 * ✅ TourAPI v2 안정형 버전 (날짜 + 키워드 + 축제 타입)
 */
export async function fetchPersonalJourney({
  keywords = [],
  startDate,
  endDate,
}) {
  const results = [];

  const toYMD = (d) =>
    d
      ? `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
          d.getDate()
        ).padStart(2, "0")}`
      : "";

  const startYmd = toYMD(startDate) || `${new Date().getFullYear()}0101`;
  const endYmd = toYMD(endDate) || `${new Date().getFullYear()}1231`;

  console.log("🔑 API KEY 확인:", SERVICE_KEY ? "✅ 있음" : "❌ 없음");

  for (const keyword of keywords) {
    try {
      const res = await axios.get(`${BASE_URL}/searchKeyword2`, {
        params: {
          serviceKey: SERVICE_KEY,
          MobileOS: "ETC",
          MobileApp: "LococoApp",
          _type: "json",
          numOfRows: 100,
          pageNo: 1,
          arrange: "Q",
          keyword,
          contentTypeId: 15, // ✅ 축제/공연/행사만 검색
        },
      });

      const items = res.data?.response?.body?.items?.item || [];
      console.log(`📡 [${keyword}] ${items.length}건`);
      results.push(...(Array.isArray(items) ? items : [items]));
    } catch (err) {
      console.warn(`⚠️ [${keyword}] 요청 실패 (${err.message})`);
    }
  }

  const unique = Array.from(
    new Map(results.map((f) => [f.contentid, f])).values()
  );
  const filtered = unique.filter((f) => {
    const s = f.eventstartdate ? Number(f.eventstartdate) : 0;
    const e = f.eventenddate ? Number(f.eventenddate) : 99999999;
    return s <= Number(endYmd) && e >= Number(startYmd);
  });

  console.log(`🎯 [개인여정] 필터링 후 ${filtered.length}건`);
  return filtered.map((f) => ({
    id: f.contentid,
    title: f.title,
    location: `${f.addr1 || ""} ${f.addr2 || ""}`,
    imageUrl: f.firstimage || "/image/default.png",
    date: f.eventstartdate || "기간 미정",
    description: f.overview || "설명이 없습니다.",
  }));
}
