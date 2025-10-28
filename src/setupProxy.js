const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // 🔹 기존 백엔드 프록시 (그대로 유지)
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://3.39.0.20:8080",
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    })
  );

  // 🔹 TourAPI 프록시 (최종 확정 버전)
  app.use(
    "/tourapi",
    createProxyMiddleware({
      target: "https://apis.data.go.kr/B551011/KorService2", // ✅ KorService2로 직접 지정
      changeOrigin: true,
      secure: true,
      logLevel: "debug",
      // pathRewrite 제거해야 중복 경로 안 생김
      // ✅ 절대 pathRewrite 쓰지 마!
    })
  );
};
