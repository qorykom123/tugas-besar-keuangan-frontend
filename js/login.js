document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  if (!form) {
    console.warn("form-login tidak ditemukan");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.message || "Login gagal");
        return;
      }

      setToken(json.token);
      alert("Login berhasil!");
      window.location.href = "index.html";
    } catch (err) {
      alert("Gagal konek ke server");
      console.error(err);
    }
  });
});

// ================== REGISTER ==================
const formRegister = document.querySelector("form.signup");

if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = formRegister
      .querySelector('input[type="text"]')
      .value.trim();
    const password = formRegister
      .querySelector('input[type="password"]')
      .value.trim();

    if (!username || !password) {
      alert("Username & password wajib diisi");
      return;
    }

    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.message || "Register gagal");
        return;
      }

      alert("Register berhasil! Silakan login.");

      // balik ke tab login
      document.getElementById("login").checked = true;
      document.querySelector("label.login").click();
    } catch (err) {
      alert("Gagal konek ke server");
      console.error(err);
    }
  });
}
