document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  const form = document.getElementById("form-update");
  const btnCancel = document.getElementById("btn-cancel");

  if (!form) {
    console.error("Form tidak ditemukan");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID transaksi tidak ditemukan di URL");
    window.location.href = "index.html";
    return;
  }

  btnCancel?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // ==========================
  // 1) LOAD DETAIL
  // ==========================
  try {
    const res = await authFetch(`${API_KEUANGAN}/${id}`);
    const json = await res.json();

    if (!res.ok) {
      alert(json?.message || "Gagal ambil detail transaksi");
      return;
    }

    const trx = json.data;

    document.getElementById("tanggal").value = trx.tanggal?.split("T")[0] || "";
    document.getElementById("jenis").value = trx.jenis || "";
    document.getElementById("kategori").value = trx.kategori || "";
    document.getElementById("deskripsi").value = trx.deskripsi || "";
    document.getElementById("jumlah").value = trx.jumlah || 0;
  } catch (err) {
    alert("Error koneksi saat ambil detail");
    console.error(err);
    return;
  }

  // ==========================
  // 2) SUBMIT UPDATE
  // ==========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      tanggal: document.getElementById("tanggal").value,
      jenis: document.getElementById("jenis").value,
      kategori: document.getElementById("kategori").value.trim(),
      deskripsi: document.getElementById("deskripsi").value.trim(),
      jumlah: parseInt(document.getElementById("jumlah").value) || 0,
    };

    try {
      const res = await authFetch(`${API_KEUANGAN}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.message || "Gagal update transaksi");
        return;
      }

      alert(json?.message || "Transaksi berhasil diupdate");
      window.location.href = "index.html";
    } catch (err) {
      alert("Error koneksi ke server");
      console.error(err);
    }
  });
});
