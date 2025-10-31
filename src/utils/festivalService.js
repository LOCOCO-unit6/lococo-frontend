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
export async function fetchFestivalDetail(contentId) {
  try {
    const { data } = await api.get("detailCommon1", {
      params: {
        contentId,
        overviewYN: "Y",
        defaultYN: "Y",
        mapinfoYN: "Y",
        MobileOS: "ETC",
        MobileApp: "LOCOKO",
        numOfRows: 1,
        pageNo: 1,
      },
    });

    console.log("📌 상세 API Raw Data:", data);

    const item = data?.response?.body?.items?.item;
    const f = Array.isArray(item) ? item[0] : item;

    return {
      id: contentId,
      title: f?.title ?? "",
      image: f?.firstimage ?? "",
      overview: f?.overview ?? "",
      address: f?.addr1 ?? "",
      startDate: f?.eventstartdate ?? "",
      endDate: f?.eventenddate ?? "",
      lat: f?.mapy ? Number(f.mapy) : null,
      lng: f?.mapx ? Number(f.mapx) : null,
    };
  } catch (err) {
    console.error("❌ fetchFestivalDetail 실패:", err);
    return null;
  }
}
