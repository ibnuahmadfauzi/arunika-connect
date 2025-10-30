$(document).ready(function () {
  let db;

  // create ArunikaconnectDB
  const request = indexedDB.open("ArunikaconnectDB", 2);

  // first
  request.onupgradeneeded = function (event) {
    db = event.target.result;

    // Buat object store pertama jika belum ada
    if (!db.objectStoreNames.contains("guest")) {
      db.createObjectStore("guest", { keyPath: "id", autoIncrement: true });
      console.log("Object store 'guest' berhasil dibuat");
    }

    // Buat object store kedua jika belum ada
    if (!db.objectStoreNames.contains("user")) {
      db.createObjectStore("user", { keyPath: "id", autoIncrement: true });
      console.log("Object store 'user' berhasil dibuat");
    }
  };

  // success DB access
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database siap digunakan");
    buatUserDefault();
  };

  // fail DB access
  request.onerror = function (event) {
    console.error("Gagal membuka database", event.target.error);
  };

  // create new user
  function buatUserDefault() {
    const tx = db.transaction("user", "readonly");
    const store = tx.objectStore("user");
    const checkRequest = store.getAll();

    checkRequest.onsuccess = function () {
      if (checkRequest.result.length === 0) {
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        const userBaru = {
          id: `ARK${randomNumber}`,
          fullname: "Administrator",
          username: "administrator",
          password: "12345678",
        };

        const txAdd = db.transaction("user", "readwrite");
        const storeAdd = txAdd.objectStore("user");
        const addReq = storeAdd.add(userBaru);

        addReq.onsuccess = function () {
          console.log("🟢 User default berhasil dibuat:", userBaru);
        };

        addReq.onerror = function (e) {
          console.error("❌ Gagal membuat user default:", e.target.error);
        };
      } else {
        console.log("ℹ️ User sudah ada, tidak perlu membuat baru.");
      }
    };
  }

  // create new 'guest' data
  $(document).on("submit", "#guest-form", function (e) {
    e.preventDefault();

    // get input data
    const name = $("#form-input-name").val();
    const gender = $("#form-input-gender").val();
    const job = $("#form-input-job").val();
    const address = $("#form-input-address").val();
    const phone = $("#form-input-phone").val();
    const email = $("#form-input-email").val();
    const instansi = $("#form-input-instansi").val();

    // debug
    // console.log(name);
    // console.log(gender);
    // console.log(job);
    // console.log(address);
    // console.log(phone);
    // console.log(email);
    // console.log(instansi);

    // store
    const tx = db.transaction("guest", "readwrite");
    const store = tx.objectStore("guest");
    store.add({
      name: name,
      gender: gender,
      job: job,
      address: address,
      phone: phone,
      email: email,
      instansi: instansi,
    });

    tx.oncomplete = () => {
      Swal.fire({
        title: "Terima Kasih",
        text: "Selamat Datang di Booth PT. Arunika Saha Vikasa",
        icon: "success",
      });
    };

    // reset input
    $("#form-input-name").val("");
    $("#form-input-gender").val("");
    $("#form-input-job").val("");
    $("#form-input-address").val("");
    $("#form-input-phone").val("");
    $("#form-input-email").val("");
    $("#form-input-instansi").val("");
  });

  function tampilkanData() {
    const tx = db.transaction("guest", "readonly");
    const store = tx.objectStore("guest");

    console.log("📋 Semua data di IndexedDB:");
    store.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        console.log("-----------------------------");
        console.log(`ID: ${cursor.value.id}`);
        console.log(`Nama: ${cursor.value.name}`);
        console.log(`Gender: ${cursor.value.gender}`);
        console.log(`Pekerjaan: ${cursor.value.job}`);
        console.log(`Alamat: ${cursor.value.address}`);
        console.log(`Telepon: ${cursor.value.phone}`);
        console.log(`Email: ${cursor.value.email}`);
        console.log(`Instansi: ${cursor.value.instansi}`);
        cursor.continue();
      } else {
        console.log("-----------------------------");
        console.log("✅ Semua data sudah ditampilkan.");
      }
    };
  }
});
