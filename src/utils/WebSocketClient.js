// src/utils/WebSocketClient.js
const { protocol, hostname } = window.location;

const API_HOST =
  process.env.REACT_APP_API_HOST ||
  (hostname === "localhost" ? "localhost:8080" : "3.39.0.20:8080");

export const WS_URL =
  (protocol === "https:" ? "wss://" : "ws://") + API_HOST + "/ws";

console.log("[WS_URL]", WS_URL); // ✅ 실제 붙는 주소 확인용

const socket = new WebSocket(WS_URL);
export default socket;
