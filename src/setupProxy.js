const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // ✅ 기존 백엔드 프록시 유지
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://3.39.0.20:8080",
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    })
  );

  // ✅ TourAPI v2 (CORS 완전 대응)
  app.use(
    "/tourapi",
    createProxyMiddleware({
      target: "https://apis.data.go.kr/B551011/KorService2",
      changeOrigin: true,
      secure: true,
      logLevel: "debug",

      // 🚀 핵심: 중복 Origin 헤더 제거
      onProxyRes(proxyRes) {
        const key = "access-control-allow-origin";
        const header = proxyRes.headers[key];
        if (header && header.includes(",")) {
          proxyRes.headers[key] = header.split(",")[0].trim();
        }
      },
    })
  );
};
