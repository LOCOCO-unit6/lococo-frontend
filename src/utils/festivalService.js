// src/utils/festivalService.js

import api from "../api/tourApi";

/* ✅ 축제 목록 조회 (유지) */
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
      tel: i.tel ?? "",
      lat: i.mapy ? Number(i.mapy) : null,
      lng: i.mapx ? Number(i.mapx) : null,
    }));
  } catch (err) {
    console.error("❌ fetchFestivals 실패:", err);
    return [];
  }
}

// 🚨 TourAPI 2.0 (detailIntro2)를 호출하는 함수 (운영 시간, 주최사 정보 획득)
async function fetchFestivalIntro2(contentId) {
  try {
    const { data } = await api.get("detailIntro2", {
      params: {
        contentId,
        contentTypeId: 15, // 축제 타입 ID (15)
      },
    });
    const item = data?.response?.body?.items?.item;
    // playtime, sponsor1 등의 필드가 포함되어 있음
    return Array.isArray(item) ? item[0] : item;
  } catch {
    return {}; // 실패 시 빈 객체 반환
  }
}

/* ✅ 상세조회: Common1 + Intro2 병합 */
export async function fetchFestivalDetail(contentId) {
  if (!contentId) return null;

  try {
    // [Common API 호출] (detailCommon1)과 [Intro API 호출] (detailIntro2)을 동시에 실행합니다.
    const [commonRes, introData] = await Promise.all([
      api.get("detailCommon1", {
        params: {
          contentId,
          overviewYN: "Y",
          defaultYN: "Y",
          mapinfoYN: "Y",
          telinfoYN: "Y", // 연락처 정보 요청
          MobileOS: "ETC",
          MobileApp: "LOCOKO",
          numOfRows: 1,
          pageNo: 1,
        },
      }),
      fetchFestivalIntro2(contentId), // Intro API 호출
    ]);

    const commonData = commonRes?.data;
    const item = commonData?.response?.body?.items?.item;
    const f = Array.isArray(item) ? item[0] : item; // Common Data
    const intro = introData || {}; // Intro Data

    // 데이터 부재 확인
    if (!f || !f.contentid) {
      return null;
    }

    return {
      id: contentId,
      title: f?.title ?? "",
      image: f?.firstimage ?? "",
      overview: f?.overview ?? "", // Common API에서 가져온 개요
      address: f?.addr1 ?? "주소 정보 없음", // 🌟🌟🌟 Intro API에서 가져온 정보 병합 🌟🌟🌟
      tel: f?.tel ?? "", // Common API에서 가져온 연락처
      playtime: intro.playtime ?? "", // Intro API (운영 시간)
      sponsor: intro.sponsor1 ?? "", // Intro API (주최사)
      // ---------------------------------------------

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
