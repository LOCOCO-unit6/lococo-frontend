const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://3.39.0.20:8080",
      changeOrigin: true,
      ws: true,
      logLevel: "debug", // 터미널에 프록시 로그 찍힘
      // 필요 시 경로 바꾸려면: pathRewrite: { '^/api': '' }
    })
  );
};
