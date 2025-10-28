$(document).ready(function () {
  $("#export-excel").on("click", function () {
    // Clone tabel agar yang asli tidak berubah di halaman
    const tableClone = document.getElementById("guest-table").cloneNode(true);

    // Hapus kolom terakhir (#) dari setiap baris (thead + tbody)
    const columnIndexToRemove = tableClone.rows[0].cells.length - 1;
    for (let row of tableClone.rows) {
      if (row.cells.length > columnIndexToRemove) {
        row.deleteCell(columnIndexToRemove);
      }
    }

    // Konversi tabel ke workbook Excel
    const wb = XLSX.utils.table_to_book(tableClone, {
      sheet: "Data Pengunjung",
    });

    // Simpan file .xlsx
    XLSX.writeFile(wb, "data_pengunjung.xlsx");
  });
});
