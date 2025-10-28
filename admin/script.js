$(document).ready(function () {
  // Ambil semua data dari DataTables, bukan cuma yang tampil
  const table = $("#guest-table").DataTable();
  const allData = table.rows({ search: "applied" }).data().toArray();

  // Ambil header
  const headers = [];
  $("#guest-table thead th").each(function () {
    const headerText = $(this).text().trim();
    if (headerText !== "#") {
      // abaikan kolom aksi
      headers.push(headerText);
    }
  });

  // Ubah data jadi array dua dimensi (tanpa kolom aksi)
  const exportData = allData.map((row) => {
    // row bisa berupa array atau objek tergantung konfigurasi
    const values = Array.isArray(row) ? row : Object.values(row);
    return values.slice(0, -1); // hapus kolom terakhir (‘#’)
  });

  // Gabungkan header + data
  const worksheetData = [headers.slice(0, -1), ...exportData];

  // Buat workbook dari SheetJS
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Data Pengunjung");

  // Simpan file
  XLSX.writeFile(wb, "data_pengunjung.xlsx");
});
