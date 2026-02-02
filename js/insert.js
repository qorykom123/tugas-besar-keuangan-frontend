document.addEventListener("DOMContentLoaded", () => {
  if (!requireAuth()) return;

  const form = document.getElementById("form-insert");
  const btnCancel = document.getElementById("btn-cancel");

  btnCancel?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const jenis = document.getElementById("jenis").value;
    const kategori = document.getElementById("kategori").value.trim();
    const deskripsi = document.getElementById("deskripsi").value.trim();
    const jumlah = parseInt(document.getElementById("jumlah").value);

    if (!tanggal || !jenis || !kategori || !jumlah) {
      alert("Tanggal, jenis, kategori, dan jumlah wajib diisi!");
      return;
    }

    const payload = {
      tanggal,
      jenis,
      kategori,
      deskripsi,
      jumlah,
    };

    try {
      const res = await authFetch(API_KEUANGAN, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.message || "Gagal insert transaksi");
        return;
      }

      alert(json?.message || "Transaksi berhasil ditambahkan");
      window.location.href = "index.html";
    } catch (err) {
      alert("Error koneksi ke server");
      console.error(err);
    }
  });
});
