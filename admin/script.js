// Fungsi ambil data dari IndexedDB
function getAllGuests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ArunikaconnectDB", 2);

    request.onerror = () => reject("Gagal membuka database");
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("guest", "readonly");
      const store = transaction.objectStore("guest");
      const getRequest = store.getAll();

      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject("Gagal mengambil data");
    };
  });
}

// Fungsi export ke Excel
async function exportToExcel() {
  try {
    const data = await getAllGuests();

    if (!data || data.length === 0) {
      Swal.fire({
        title: "Gagal Export",
        text: "tidak ada data pengunjung yang tersedia",
        icon: "warning",
      });
      return;
    }

    // Ubah ke format array untuk SheetJS
    const sheetData = data.map((item, index) => ({
      No: index + 1,
      Nama: item.name,
      Gender: item.gender,
      Pekerjaan: item.job,
      Alamat: item.address,
      "Nomor HP": item.phone,
      Email: item.email,
      "Asal Instansi": item.institution,
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guest Data");

    // Simpan ke file Excel
    XLSX.writeFile(workbook, "data_pengunjung.xlsx");
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat export Excel!");
  }
}

// Event tombol export
document
  .getElementById("export-excel")
  .addEventListener("click", exportToExcel);
