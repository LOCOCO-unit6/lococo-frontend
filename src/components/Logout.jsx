import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth } from "../utils/auth";
import Cookies from "js-cookie";

export default function Logout() {
  const nav = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    clearAuth();
    // 돌아갈 곳이 주최자 영역이면 로그인으로, 아니면 홈
    Cookies.remove("token");
    const toOrganizer =
      (loc.state && loc.state.from?.startsWith("/organizer")) || false;
    nav(toOrganizer ? "/login" : "/", { replace: true });
  }, [nav, loc]);
  return null;
}
