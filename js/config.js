// ================== API CONFIG ==================
const API_BASE = "https://tugas-besar-keuangan-backend-production.up.railway.app/api";

const API_LOGIN = `${API_BASE}/login`;
const API_REGISTER = `${API_BASE}/register`;
const API_KEUANGAN = `${API_BASE}/keuangan`;

// ================== JWT HELPERS ==================
const TOKEN_KEY = "token";

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getUserRole() {
  const token = getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role;
}

// ================== AUTH GUARD ==================
// redirect ke login kalau belum login
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ================== AUTH FETCH ==================
// fetch otomatis bawa Authorization Bearer token
async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  // kalau token expired / invalid → logout paksa
  if (res.status === 401) {
    clearToken();
    alert("Sesi habis. Silakan login ulang.");
    window.location.href = "login.html";
    return Promise.reject(new Error("Unauthorized"));
  }

  return res;
}
// ================== GLOBAL LOGOUT ==================
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btn-logout");

  if (!btnLogout) return; // kalau halaman ga punya tombol logout

  btnLogout.addEventListener("click", () => {
    const yakin = confirm("Yakin ingin logout?");
    if (!yakin) return;

    clearToken();
    alert("Logout berhasil");
    window.location.href = "login.html";
  });
});
