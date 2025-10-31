import api from "../api/tourApi";

/* ✅ 축제 목록 조회 (변경 ❌) */
export async function fetchFestivals({
  startYmd,
  endYmd,
  arrange = "C",
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
        _type: "json",
      },
    });

    const item = data?.response?.body?.items?.item ?? [];
    const items = Array.isArray(item) ? item : [item];

    return items.map((i) => ({
      id: String(i.contentid ?? ""),
      title: i.title ?? "",
      address: i.addr1 ?? "",
      startDate: i.eventstartdate ?? "",
      endDate: i.eventenddate ?? "",
      image: i.firstimage || i.firstimage2 || "",
      lat: i.mapy ? Number(i.mapy) : null,
      lng: i.mapx ? Number(i.mapx) : null,
    }));
  } catch (err) {
    console.error("❌ fetchFestivals 실패:", err);
    return [];
  }
}

/* ✅ 소개 정보 조회 */
async function fetchFestivalIntro(contentId) {
  try {
    const { data } = await api.get("detailIntro1", {
      params: {
        contentId,
        MobileOS: "ETC",
        MobileApp: "LOCOKO",
        _type: "json",
      },
    });

    const item = data?.response?.body?.items?.item;
    const f = Array.isArray(item) ? item[0] : item;

    return f?.overview || f?.infocenter || f?.eventhomepage || f?.program || "";
  } catch {
    return "";
  }
}

/* ✅ 상세조회: Common + Intro 병합 */
export async function fetchFestivalDetail(contentId) {
  try {
    const { data } = await api.get("detailCommon2", {
      params: {
        contentId,
        overviewYN: "Y",
        defaultYN: "Y",
        mapinfoYN: "Y",
        MobileOS: "ETC",
        MobileApp: "LOCOKO",
        _type: "json",
      },
    });

    const item = data?.response?.body?.items?.item;
    const f = Array.isArray(item) ? item[0] : item;

    // ✅ 소개 데이터 보강
    const intro = await fetchFestivalIntro(contentId);

    return {
      id: contentId,
      title: f?.title ?? "",
      image: f?.firstimage ?? "",
      address: f?.addr1 ?? "주소 정보 없음",
      startDate: f?.eventstartdate ?? "",
      endDate: f?.eventenddate ?? "",
      overview: intro || f?.overview || "",
      lat: f?.mapy ? Number(f.mapy) : null,
      lng: f?.mapx ? Number(f.mapx) : null,
    };
  } catch (err) {
    console.error("❌ fetchFestivalDetail 실패:", err);
    return null;
  }
}
