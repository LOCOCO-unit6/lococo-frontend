import axios from "axios";

const BASE = "/tourapi"; // CRA setupProxy를 통해 프록시 경유

const SERVICE_KEY = process.env.REACT_APP_TOURAPI_KEY;
const APP_NAME = process.env.REACT_APP_TOURAPI_APP || "Lococo";

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  params: {
    MobileOS: "ETC",
    MobileApp: APP_NAME,
    _type: "json",
  },
});

// ✅ 키 붙이기
api.interceptors.request.use((config) => {
  config.params = { ...(config.params || {}), serviceKey: SERVICE_KEY };
  return config;
});

// ✅ 오류시 상세 로그
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const h = err?.response?.data?.response?.header;
    console.error(
      "[TourAPI Error]",
      err?.response?.status,
      h?.resultCode,
      h?.resultMsg
    );
    throw err;
  }
);

export default api;
