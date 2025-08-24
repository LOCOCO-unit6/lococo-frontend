const TOKEN_KEY = "authToken";

export function setAuth(token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("storage"));
}
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("storage"));
}
export function isAuthed() {
  return !!localStorage.getItem(TOKEN_KEY);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
