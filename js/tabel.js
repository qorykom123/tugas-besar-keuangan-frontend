document.addEventListener("DOMContentLoaded", async function () {
  if (!requireAuth()) return;

  const role = getUserRole();
  const tbody = document.getElementById("tbody-keuangan");
  const jumlah = document.getElementById("jumlah-keuangan");
  const searchDate = document.querySelector(".search-date");
  const pagination = document.getElementById("pagination");

  let allData = [];
  let filteredData = [];
  let currentPage = 1;
  const perPage = 5;

  // ===============================
  // FETCH DATA
  // ===============================
  try {
    const response = await authFetch(API_KEUANGAN);
    const hasil = await response.json();

    allData = hasil.data || [];
    filteredData = [...allData];
    jumlah.innerText = allData.length;

    render();
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-red-500 py-4">
          Gagal mengambil data
        </td>
      </tr>
    `;
  }

  // ===============================
  // RENDER TABLE
  // ===============================
  function render() {
    const start = (currentPage - 1) * perPage;
    const pageData = filteredData.slice(start, start + perPage);

    let rows = "";

    pageData.forEach((trx) => {
      let aksi = "-";

      if (role === "admin") {
        aksi = `
          <button class="btn-edit bg-yellow-400 text-white px-2 py-1 rounded text-xs"
            data-id="${trx.id}">
            Edit
          </button>
          <button class="btn-delete bg-red-500 text-white px-2 py-1 rounded text-xs ml-1"
            data-id="${trx.id}">
            Hapus
          </button>
        `;
      }

      rows += `
        <tr class="border-b border-coolGray-100">
          <td class="px-4 py-2">${trx.tanggal}</td>
          <td class="px-4 py-2">${trx.jenis || "-"}</td>
          <td class="px-4 py-2">${trx.kategori || "-"}</td>
          <td class="px-4 py-2">${trx.deskripsi || "-"}</td>
          <td class="px-4 py-2">
            Rp ${Number(trx.jumlah || 0).toLocaleString("id-ID")}
          </td>
          <td class="px-4 py-2">${aksi}</td>
        </tr>
      `;
    });

    tbody.innerHTML = rows;
    renderPagination();
    attachButtons();
  }

  // ===============================
  // PAGINATION
  // ===============================
  function renderPagination() {
    const totalPage = Math.ceil(filteredData.length / perPage);
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.className =
        "px-3 py-1 border rounded " +
        (i === currentPage ? "bg-green-500 text-white" : "bg-white");

      btn.addEventListener("click", () => {
        currentPage = i;
        render();
      });

      pagination.appendChild(btn);
    }
  }

  // ===============================
  // BUTTON EVENTS
  // ===============================
  function attachButtons() {
    if (role !== "admin") return;

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        window.location.href = `update.html?id=${encodeURIComponent(id)}`;
      });
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

        try {
          const res = await authFetch(`${API_KEUANGAN}/${id}`, {
            method: "DELETE",
          });

          const json = await res.json();

          if (!res.ok) {
            alert(json?.message || "Gagal menghapus data");
            return;
          }

          alert(json?.message || "Transaksi berhasil dihapus");
          location.reload();
        } catch (err) {
          alert("Error koneksi ke server");
          console.error(err);
        }
      });
    });
  }

  // ===============================
  // SEARCH BY DATE
  // ===============================
  if (searchDate) {
    searchDate.addEventListener("change", () => {
      const selected = searchDate.value; // YYYY-MM-DD

      if (!selected) {
        filteredData = [...allData];
      } else {
        filteredData = allData.filter((trx) => trx.tanggal === selected);
      }

      currentPage = 1;
      render();
    });
  }
});

flatpickr("#search-date", {
  dateFormat: "Y-m-d",
  allowInput: true,
});
