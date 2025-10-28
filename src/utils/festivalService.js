import api from "../api/tourApi";

export async function fetchFestivals({
  startYmd,
  endYmd,
  arrange = "C", // 수정일 최신순
  pageNo = 1,
  numOfRows = 30,
} = {}) {
  try {
    const { data } = await api.get("searchFestival2", {
      params: {
        eventStartDate: startYmd,
        eventEndDate: endYmd,
        arrange,
        pageNo,
        numOfRows,
        // ❌ KorService2는 listYN, contentTypeId 파라미터 사용 안 함!
      },
    });

    console.log("🔥 API Raw Data:", data);

    const item = data?.response?.body?.items?.item ?? [];
    const items = Array.isArray(item) ? item : [item];

    return items.map((i) => ({
      id: String(i.contentid ?? ""),
      title: i.title ?? "",
      address: i.addr1 ?? "",
      startDate: i.eventstartdate ?? "",
      endDate: i.eventenddate ?? "",
      image: i.firstimage || i.firstimage2 || "",
      tel: i.tel ?? "",
      lat: i.mapy ? Number(i.mapy) : null,
      lng: i.mapx ? Number(i.mapx) : null,
    }));
  } catch (err) {
    console.error("❌ fetchFestivals 실패:", err);
    return [];
  }
}
