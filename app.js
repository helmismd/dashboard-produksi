// ======================================================
// DASHBOARD PACKING PLANT SAMARINDA
// APP.JS V2.0
// ======================================================

let chartProduksi = null;
let dashboardData = {};
// ===========================
// KONFIGURASI GITHUB
// ===========================

const GITHUB_USER = "helmismd";
const GITHUB_REPO = "dashboard-produksi";
const GITHUB_BRANCH = "main";
const GITHUB_FILE = "data.json";
const HISTORY_FILE = "history.json";

function formatTon(nilai) {
    return Number(nilai).toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " Ton";
}

document
    .getElementById("excelFile")
    .addEventListener("change", bacaExcel);


function cariBaris(rows, teks) {

    for (let i = 0; i < rows.length; i++) {

        for (let j = 0; j < rows[i].length; j++) {

            if (String(rows[i][j]).trim() === teks) {

                return i;

            }

        }

    }

    return -1;

}

function hitungKPI(produk, ton, hasil) {

    if (produk.includes("BAG")) {

        hasil.bag += ton;

        if (produk.includes("/OPC")) {
            hasil.opc += ton;
        } else {
            hasil.pcc += ton;
        }

    }

    else if (produk.includes("ULTRAPRO")) {

        hasil.bulk += ton;
        hasil.opc += ton;

    }

    else if (produk.includes("EZPRO")) {

        hasil.bulk += ton;
        hasil.pcc += ton;

    }

}

function bacaExcel(e) {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(evt){

        const data = new Uint8Array(evt.target.result);

        const workbook = XLSX.read(data,{
            type:"array"
        });

        // ==========================
        // CARI SHEET HARIAN TERBARU
        // ==========================

       const daftarSheet = workbook.SheetNames
    .filter(n => /^\d{2}-\d{2}-\d{2}\s*$/.test(n));

console.log(daftarSheet);

const namaSheet = daftarSheet[daftarSheet.length - 1];
const bulanAktif = namaSheet.substring(3, 8);

let bulanOPC = 0;
let bulanPCC = 0;
let bulanBag = 0;
let bulanBulk = 0;
let bulanTotal = 0;

        if(!namaSheet){
            alert("Sheet harian tidak ditemukan.");
            return;
        }

        const sheet = workbook.Sheets[namaSheet];

        const rows = XLSX.utils.sheet_to_json(sheet,{
            header:1,
            defval:""
        });


// ==========================
// HITUNG PRODUKSI BULANAN
// ==========================

for (const sheetBulanan of daftarSheet) {

    // Hanya hitung sheet pada bulan yang sama
    if (!sheetBulanan.includes(bulanAktif)) continue;

    const wsBulanan = workbook.Sheets[sheetBulanan];


    const rowsBulanan = XLSX.utils.sheet_to_json(wsBulanan, {
        header: 1,
        defval: ""
    });

    console.log(sheetBulanan, rowsBulanan.length);

}//
       // ===========================
// IDENTIFIKASI BARIS
// ===========================

const rTotal = cariBaris(rows,"TOTAL PRODUKSI");
const rPCC   = cariBaris(rows,"Fisik Ukur SILO PCC");
const rOPC   = cariBaris(rows,"Fisik Ukur SILO OPC");

if(rTotal<0 || rPCC<0 || rOPC<0){
    alert("Format LHP tidak sesuai.");
    return;
}

        // ==========================
        // PERIODE
        // ==========================

const periode = String(rows[5][2]).replace(":","").trim();




// ===========================
// VARIABEL PRODUKSI
// ===========================

let totalOPC = 0;
let totalPCC = 0;
let totalBag = 0;
let totalBulk = 0;




        // ==========================
        // STOK SILO
        // ==========================

const stokPCC = Number(rows[rPCC][5]) || 0;
const stokOPC = Number(rows[rOPC][5]) || 0;

     

        // ===== LANJUT BAGIAN 2 =====

        

// ===========================
// HITUNG PRODUKSI
// ===========================

for (let i = 0; i < rows.length; i++) {

    const produk = String(rows[i][1] || "")
    .toUpperCase()
    .trim();

console.log(produk);


const ton = Number(rows[i][3]) || 0;

    // PRODUKSI BAG
    if (produk.includes("BAG")) {

    totalBag += ton;

    if (produk.includes("/OPC")) {
        totalOPC += ton;
    } else {
        totalPCC += ton;
    }

}

    // BULK OPC
    else if (produk.includes("ULTRAPRO")) {

        totalBulk += ton;
        totalOPC += ton;
    }

    // BULK PCC
    else if (produk.includes("EZPRO")) {

        totalBulk += ton;
        totalPCC += ton;
    }
}

const grandTotal =
   
    totalOPC +
    totalPCC;

// ===========================
// PRODUKSI TAHUNAN
// AMBIL DARI KOLOM S/D TAHUN INI
// ===========================

let tahunOPC = 0;
let tahunPCC = 0;
let tahunBag = 0;
let tahunBulk = 0;
let tahunTotal = 0;

for (let i = 0; i < rows.length; i++) {

    const produk = String(rows[i][1] || "")
        .toUpperCase()
        .trim();

    // Kolom J = Ton S/D Tahun Ini
    const ton = Number(rows[i][9]) || 0;

    const hasil = {
        bag: tahunBag,
        bulk: tahunBulk,
        opc: tahunOPC,
        pcc: tahunPCC
    };

    hitungKPI(produk, ton, hasil);

    tahunBag  = hasil.bag;
    tahunBulk = hasil.bulk;
    tahunOPC  = hasil.opc;
    tahunPCC  = hasil.pcc;
}

tahunTotal = tahunBag + tahunBulk;
// ===========================console.log("Hitung :", sheetBulanan);
// PRODUKSI BULANAN
// ===========================


for (const sheetBulanan of daftarSheet) {

    // Hanya hitung bulan aktif
    if (!sheetBulanan.includes(bulanAktif)) continue;

    const wsBulanan = workbook.Sheets[sheetBulanan];

    const rowsBulanan = XLSX.utils.sheet_to_json(wsBulanan, {
        header: 1,
        defval: ""
    });


let bOPC = 0;
let bPCC = 0;
let bBag = 0;
let bBulk = 0;

for (let i = 0; i < rowsBulanan.length; i++) {

    const produk = String(rowsBulanan[i][1] || "")
    .toUpperCase()
    .trim();

const ton = Number(rowsBulanan[i][3]) || 0;

    const hasil = {
    bag: bBag,
    bulk: bBulk,
    opc: bOPC,
    pcc: bPCC
};

hitungKPI(produk, ton, hasil);

bBag  = hasil.bag;
bBulk = hasil.bulk;
bOPC  = hasil.opc;
bPCC  = hasil.pcc;
}

console.log(
    sheetBulanan,
    "OPC =", bOPC,
    "PCC =", bPCC,
    "Bag =", bBag,
    "Bulk =", bBulk,
    "Total =", bBag + bBulk
);



bulanOPC += bOPC;
bulanPCC += bPCC;
bulanBag += bBag;
bulanBulk += bBulk;
bulanTotal += (bBag + bBulk);

console.log(sheetBulanan, bOPC + bPCC);

    
}

console.log("========================");
console.log("TOTAL BULAN");
console.log("OPC   :", bulanOPC);
console.log("PCC   :", bulanPCC);
console.log("BAG   :", bulanBag);
console.log("BULK  :", bulanBulk);
console.log("TOTAL :", bulanTotal);



      // ===========================
// PERIODE DASHBOARD
// ===========================

document.getElementById("periode").textContent = periode;

document.getElementById("lastUpdate").textContent =
    "Data terakhir diperbarui : " + periode;


       // ===========================
// KPI PRODUKSI HARIAN
// ===========================

document.getElementById("opc").textContent =
    formatTon(totalOPC);

document.getElementById("pcc").textContent =
    formatTon(totalPCC);

document.getElementById("bag").textContent =
    formatTon(totalBag);

document.getElementById("bulk").textContent =
    formatTon(totalBulk);

document.getElementById("total").textContent =
    formatTon(grandTotal);

 // ===========================
// KPI PRODUKSI HARIAN
// ===========================

document.getElementById("bulanOpc").textContent =
    formatTon(bulanOPC);

document.getElementById("bulanPcc").textContent =
    formatTon(bulanPCC);

document.getElementById("bulanBag").textContent =
    formatTon(bulanBag);

document.getElementById("bulanBulk").textContent =
    formatTon(bulanBulk);

document.getElementById("bulanTotal").textContent =
    formatTon(bulanTotal);

// ===========================
// KPI PRODUKSI TAHUNAN
// ===========================

document.getElementById("tahunOpc").textContent =
    formatTon(tahunOPC);

document.getElementById("tahunPcc").textContent =
    formatTon(tahunPCC);

document.getElementById("tahunBag").textContent =
    formatTon(tahunBag);

document.getElementById("tahunBulk").textContent =
    formatTon(tahunBulk);

document.getElementById("tahunTotal").textContent =
    formatTon(tahunTotal);


       // ===========================
// PERSENTASE KPI
// ===========================

// ---------- HARIAN ----------
const persenOPC =
    grandTotal === 0 ? 0 : totalOPC / grandTotal * 100;

const persenPCC =
    grandTotal === 0 ? 0 : totalPCC / grandTotal * 100;

const persenBag =
    grandTotal === 0 ? 0 : totalBag / grandTotal * 100;

const persenBulk =
    grandTotal === 0 ? 0 : totalBulk / grandTotal * 100;

document.getElementById("opcPersen").textContent =
    persenOPC.toFixed(2) + " %";

document.getElementById("pccPersen").textContent =
    persenPCC.toFixed(2) + " %";

document.getElementById("bagPersen").textContent =
    persenBag.toFixed(2) + " %";

document.getElementById("bulkPersen").textContent =
    persenBulk.toFixed(2) + " %";


// ---------- BULANAN ----------
const persenBulanOPC =
    bulanTotal === 0 ? 0 : bulanOPC / bulanTotal * 100;

const persenBulanPCC =
    bulanTotal === 0 ? 0 : bulanPCC / bulanTotal * 100;

const persenBulanBag =
    bulanTotal === 0 ? 0 : bulanBag / bulanTotal * 100;

const persenBulanBulk =
    bulanTotal === 0 ? 0 : bulanBulk / bulanTotal * 100;

document.getElementById("bulanOpcPersen").textContent =
    persenBulanOPC.toFixed(2) + " %";

document.getElementById("bulanPccPersen").textContent =
    persenBulanPCC.toFixed(2) + " %";

document.getElementById("bulanBagPersen").textContent =
    persenBulanBag.toFixed(2) + " %";

document.getElementById("bulanBulkPersen").textContent =
    persenBulanBulk.toFixed(2) + " %";


// ---------- TAHUNAN ----------
const persenTahunOPC =
    tahunTotal === 0 ? 0 : tahunOPC / tahunTotal * 100;

const persenTahunPCC =
    tahunTotal === 0 ? 0 : tahunPCC / tahunTotal * 100;

const persenTahunBag =
    tahunTotal === 0 ? 0 : tahunBag / tahunTotal * 100;

const persenTahunBulk =
    tahunTotal === 0 ? 0 : tahunBulk / tahunTotal * 100;

document.getElementById("tahunOpcPersen").textContent =
    persenTahunOPC.toFixed(2) + " %";

document.getElementById("tahunPccPersen").textContent =
    persenTahunPCC.toFixed(2) + " %";

document.getElementById("tahunBagPersen").textContent =
    persenTahunBag.toFixed(2) + " %";

document.getElementById("tahunBulkPersen").textContent =
    persenTahunBulk.toFixed(2) + " %";


        // ===========================
        // Status
        // ===========================

        document.getElementById("status").textContent =
            "Data berhasil dimuat";

       dashboardData = {

    periode: periode,
    lastUpdate: "Data terakhir diperbarui : " + periode,

    totalOPC: totalOPC,
    totalPCC: totalPCC,
    totalBag: totalBag,
    totalBulk: totalBulk,
    grandTotal: grandTotal,

    bulanOPC: bulanOPC,
    bulanPCC: bulanPCC,
    bulanBag: bulanBag,
    bulanBulk: bulanBulk,
    bulanTotal: bulanTotal,

    labelTanggal: [namaSheet],
    dataProduksi: [grandTotal],

    stokSilo: {
        opc: stokOPC,
        pcc: stokPCC
    },

    tahunOPC: tahunOPC,
    tahunPCC: tahunPCC,
    tahunBag: tahunBag,
    tahunBulk: tahunBulk,
    tahunTotal: tahunTotal

};


        // ===========================
        // Refresh Grafik
        // ===========================

        if (chartProduksi) {
            chartProduksi.destroy();
        }

        const ctx = document
            .getElementById("grafikProduksi");

        chartProduksi = new Chart(ctx, {

            type: "line",

            data: {

labels: [namaSheet],

datasets: [{

    label: "Produksi Harian",

    data: [grandTotal],

                    borderWidth: 4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: false

                }]

            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: true
                    },

                    tooltip: {

                        callbacks: {

                            label: function (context) {

                                return "Produksi : " +
                                    Number(context.parsed.y)
                                    .toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }) +
                                    " Ton";

                            }

                        }

                    }

                },

                interaction: {
                    intersect: false,
                    mode: "index"
                }

            }

        });

    };

    reader.readAsArrayBuffer(file);

}

// ======================================================
// PUBLISH DASHBOARD
// ======================================================

document
    .getElementById("publishBtn")
    .addEventListener("click", publishDashboard);
document.getElementById("resetExcelBtn").addEventListener("click", function(){

    document.getElementById("excelFile").value = "";

});
document.getElementById("resetExcelBtn").addEventListener("click", function(){

    document.getElementById("excelFile").value = "";

});

document.getElementById("resetWABtn").addEventListener("click", function(){

    document.getElementById("waInput").value = "";

});
async function publishDashboard() {

    console.log("dashboardData =", dashboardData);

    if (Object.keys(dashboardData).length === 0) {
        alert("Silakan pilih file Excel terlebih dahulu.");
        return;
    }

    try {

    const token = tokenInput.value.trim();

    window.githubToken = token;

    if (!token) {
        alert("Masukkan GitHub Token terlebih dahulu.");
        return;
    }

    document.getElementById("status").textContent =
        "Mengupload ke GitHub...";

            
        // =====================
        // Download history
        // =====================

        const history = await downloadHistory(window.githubToken);

        console.log("Jumlah history =", history.length);
        console.log(history);

        const dataBaru = {

            tahun: new Date().getFullYear(),

            periode: dashboardData.periode,

            totalOPC: dashboardData.totalOPC,
            totalPCC: dashboardData.totalPCC,
            totalBag: dashboardData.totalBag,
            totalBulk: dashboardData.totalBulk,
            grandTotal: dashboardData.grandTotal

        };


        // =====================
        // Update history
        // =====================

        const historyBaru = history.filter(
            item => item.periode !== dashboardData.periode
        );

        historyBaru.push(dataBaru);
	
	/*
        // =====================
        // Hitung Tahunan
        // =====================

        const hasilTahun =
            hitungTahunanHistory(
                historyBaru,
                new Date().getFullYear()
            );

        dashboardData.tahunOPC = hasilTahun.opc;
        dashboardData.tahunPCC = hasilTahun.pcc;
        dashboardData.tahunBag = hasilTahun.bag;
        dashboardData.tahunBulk = hasilTahun.bulk;
        dashboardData.tahunTotal = hasilTahun.total;

        console.log(JSON.stringify(hasilTahun, null, 2));
        console.log(JSON.stringify(historyBaru, null, 2));
	*/


        // =====================
        // Baru upload
        // =====================

        await uploadGithub();

        await uploadHistory(
            window.githubToken,
            historyBaru
        );

        document.getElementById("status").textContent =
            "Dashboard berhasil dipublish.";

    }

    catch (err) {

        if (err.name !== "AbortError") {

            console.error(err);

            alert(err.message);

            document.getElementById("status").textContent =
                "Publish gagal.";

        }

    }

}
// ===========================
// SIMPAN TOKEN GITHUB
// ===========================

const tokenInput = document.getElementById("githubToken");
const remember = document.getElementById("rememberToken");
const saveBtn = document.getElementById("saveTokenBtn");

// Ambil token jika pernah disimpan
const savedToken = localStorage.getItem("githubToken");

if(savedToken){
    tokenInput.value = savedToken;
    remember.checked = true;
}

// Simpan token

saveBtn.addEventListener("click", () => {

    if (remember.checked) {

        localStorage.setItem(
            "githubToken",
            tokenInput.value.trim()
        );

        alert("✅ Token berhasil disimpan.");

    } else {

        localStorage.removeItem("githubToken");

        alert("Token tidak disimpan.");

    }

});


async function downloadData(token) {

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        return {};
    }

    const json = await response.json();

    const text = decodeURIComponent(
        escape(atob(json.content.replace(/\n/g, "")))
    );

    return JSON.parse(text);

}

// ===========================
// AMBIL SHA FILE GITHUB
// ===========================

async function getGithubSHA(token) {

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

    const response = await fetch(url, {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    if (!response.ok) {
        throw new Error("Tidak dapat membaca data.json di GitHub");
    }

    const json = await response.json();

    return json.sha;

}

async function getHistorySHA(token) {

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${HISTORY_FILE}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        return null;
    }

    const json = await response.json();

    return json.sha;

}


async function downloadHistory(token) {

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${HISTORY_FILE}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        return [];
    }

    const json = await response.json();

    const text = decodeURIComponent(
        escape(atob(json.content.replace(/\n/g, "")))
    );

    return JSON.parse(text);

}

function hitungTahunanHistory(history, tahun) {

    let hasil = {
        opc: 0,
        pcc: 0,
        bag: 0,
        bulk: 0,
        total: 0
    };

    for (const item of history) {

        if (item.tahun != tahun) continue;

        hasil.opc += Number(item.totalOPC) || 0;
        hasil.pcc += Number(item.totalPCC) || 0;
        hasil.bag += Number(item.totalBag) || 0;
        hasil.bulk += Number(item.totalBulk) || 0;
        hasil.total += Number(item.grandTotal) || 0;
    }

    return hasil;
}

async function uploadHistory(token, history) {

    const sha = await getHistorySHA(token);

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${HISTORY_FILE}`;

    const content =
        btoa(unescape(
            encodeURIComponent(
                JSON.stringify(history, null, 2)
            )
        ));

    const body = {
        message: "Update History Dashboard",
        content: content,
        branch: GITHUB_BRANCH
    };

    if (sha) {
        body.sha = sha;
    }

    const response = await fetch(url, {

        method: "PUT",

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify(body)

    });

    if (!response.ok) {

        const err = await response.json();

        console.error(err);

        throw new Error("Upload history.json gagal.");

    }

}

// ===========================
// UPLOAD DATA.JSON KE GITHUB
// ===========================

async function uploadGithub() {

    const token = window.githubToken;

    if (!token) {
        alert("Masukkan GitHub Token terlebih dahulu.");
        return;
    }

    const sha = await getGithubSHA(token);
const dataLama = await downloadData(token);

const keyLama =
    `${dataLama.kapal?.nama || ""}|${dataLama.kapal?.voyage || ""}`;

const keyBaru =
    `${dashboardData.kapal?.nama || ""}|${dashboardData.kapal?.voyage || ""}`;

dashboardData = {
    ...dataLama,
    ...dashboardData,
    kapal: (keyLama === keyBaru)
        ? {
            ...dataLama.kapal,
            ...dashboardData.kapal
        }
        : {
            ...dashboardData.kapal
        }
};

    const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

    const content =
        btoa(unescape(encodeURIComponent(
            JSON.stringify(dashboardData, null, 2)
        )));


    const response = await fetch(url, {

        method: "PUT",

        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            message: "Update Dashboard Produksi",

            content: content,

            sha: sha,

            branch: GITHUB_BRANCH

        })

    });

    if (!response.ok) {

        const err = await response.json();

        console.error(err);

        throw new Error("Upload GitHub gagal.");

    }

    alert("✅ Dashboard berhasil diupload ke GitHub.");

}

    
function ambilNilai(teks, kataKunci){

    teks = teks.replace(/\*/g,"");

    const regex = new RegExp(kataKunci + "\\s*:\\s*(.+)", "i");

    const hasil = teks.match(regex);

    return hasil ? hasil[1].trim() : "";
}

function deteksiStatusOperasi(teks){

    teks = teks.toLowerCase();

    if(teks.includes("lanjut bongkar opc"))
        return "🟢 Sedang Bongkar OPC";

    if(teks.includes("start discharge type opc"))
        return "🟢 Sedang Bongkar OPC";

    if(teks.includes("lanjut bongkar pcc"))
        return "🟢 Sedang Bongkar PCC";

    if(teks.includes("start discharge type pcc"))
        return "🟢 Sedang Bongkar PCC";

    if(teks.includes("stop bongkar"))
        return "⛔ Stop Bongkar";

    if(teks.includes("sailing to samarinda"))
        return "🚢 Dalam Pelayaran";

    if(teks.includes("drop anchor"))
        return "⚓ Sandar";

    if(teks.includes("selesai bongkar"))
        return "✅ Selesai Bongkar";

    return "-";
}




function analisaWA(){

    let teksRaw = document.getElementById("waInput").value;

    // ====================================================================
    // 🟢 PENSERAGAMAN FORMAT ENTER & EMOTICON JAM SUPER AKURAT
    // ====================================================================
    let teksClean = teksRaw.replace(/\r?\n/g, "\r\n");
    let teks = teksClean.replace(/⏰️/g, "⏱️").replace(/⏰/g, "⏱️");
    // ====================================================================

    if (!teks.toUpperCase().includes("TANGGAL")) {
        const hariIni = new Date();
        const tgl = String(hariIni.getDate()).padStart(2, '0');
        const bln = String(hariIni.getMonth() + 1).padStart(2, '0');
        const thn = hariIni.getFullYear();
        teks = `*Tanggal : ${tgl}/${bln}/${thn}*\r\n` + teks;
    }

    const kapal = {
        nama : ambilNilai(teks,"Vessel"),
        voyage : ambilNilai(teks,"Voyage"),
        total : ambilNilai(teks,"Volume"),
        pcc : ambilNilai(teks,"Type PCC") ||
              (ambilNilai(teks,"Type").toUpperCase()=="PCC"
                  ? ambilNilai(teks,"Volume")
                  : "0"),
        opc : ambilNilai(teks,"Type OPC") ||
              (ambilNilai(teks,"Type").toUpperCase()=="OPC"
                  ? ambilNilai(teks,"Volume")
                  : "0"),
        status : ambilNilai(teks,"Status Kapal")
    };

    const events = ambilEventWA(teks);
    let terakhir = eventTerakhir(events);
    let statusOperasi = terakhir ? terakhir.status : "-";

    const eventPosisi = ambilEventPosisi(teks);
    const posisiTerakhir = eventTerakhir(eventPosisi);
    const statusKapal = posisiTerakhir ? posisiTerakhir.status : "-";

    // ====================================================================
    // 🟢 BENTENG PERTAHANAN AKHIR: PAKSA AMBIL BARIS JAM VALID TERBAWAH
    // ====================================================================
    const barisTeks = teksRaw.split(/\r?\n/).map(b => b.trim()).filter(b => b !== "");
    let statusDariBarisJam = "";

    // Menyisir dari baris paling bawah ke atas
    for (let i = barisTeks.length - 1; i >= 0; i--) {
        const b = barisTeks[i];
        
        // SYARAT MUTLAK: Hanya menerima baris yang mengandung ikon jam
        if (b.includes("⏰") || b.includes("⏱️")) {
            let statusMurni = b.replace(/[⏱️⏰️⏰\*]/g, "").trim();
            
            // Hapus format angka jam di depan (misal: "06.30 Lanjut Bongkar" -> "Lanjut Bongkar")
            if (/^\d{2}[:\.]\d{2}/.test(statusMurni)) {
                statusMurni = statusMurni.replace(/^\d{2}[:\.]\d{2}/, "").trim();
            }
            statusMurni = statusMurni.replace(/^[-\s]+/, "").trim();

            if (statusMurni && statusMurni !== "") {
                statusDariBarisJam = statusMurni;
                break; // Keluar dari loop setelah menemukan baris jam terbawah
            }
        }
    }

    // Jika berhasil menemukan status dari baris jam murni, PAKSA gunakan nilai tersebut!
    if (statusDariBarisJam !== "") {
        statusOperasi = statusDariBarisJam;
        
        // Sinkronkan objek terakhir jika terjadi ketidakcocokan
        if (!terakhir || terakhir.status !== statusDariBarisJam) {
            const sekarang = new Date();
            const tgl = String(sekarang.getDate()).padStart(2, '0');
            const bln = String(sekarang.getMonth() + 1).padStart(2, '0');
            const thn = sekarang.getFullYear();
            const jam = String(sekarang.getHours()).padStart(2, '0');
            const mnt = String(sekarang.getMinutes()).padStart(2, '0');
            
            terakhir = {
                datetime: terakhir ? terakhir.datetime : `${tgl}/${bln}/${thn} ${jam}:${mnt}`,
                status: statusDariBarisJam
            };
        }
    }
    // ====================================================================

    if (typeof gantiBannerKapal === "function") {
        gantiBannerKapal(kapal.nama);
    }

    // 6 Baris logika penyelamat lokal kargo Anda yang terbukti aman
    if (!kapal.nama && !kapal.voyage) {
        kapal.nama   = document.getElementById("kapalNama").value || "-";
        kapal.voyage = document.getElementById("kapalVoyage").value || "-";
        kapal.opc    = document.getElementById("kapalOPC").value || "0";
        kapal.pcc    = document.getElementById("kapalPCC").value || "0";
        kapal.total  = document.getElementById("kapalTotal").value || "0";
        kapal.status = document.getElementById("kapalStatus").value || statusKapal || "-";
    }

    // Masukkan hasil pembersihan final ke objek memori utama sistem
    dashboardData = dashboardData || {};
    dashboardData.kapal = {
        nama: kapal.nama || "-",
        voyage: kapal.voyage || "-",
        opc: kapal.opc || "0",
        pcc: kapal.pcc || "0",
        total: kapal.total || "0",
        statusKapal: kapal.status || statusKapal || "-",
        statusOperasi: statusOperasi, // Sudah dikunci aman ke "Lanjut Bongkar"
        update: terakhir ? terakhir.datetime : ""
    };

    // Tampilkan hasil murni aman ke elemen form layar HTML Anda
    document.getElementById("kapalNama").value = dashboardData.kapal.nama;
    document.getElementById("kapalVoyage").value = dashboardData.kapal.voyage;
    document.getElementById("kapalOPC").value = dashboardData.kapal.opc;
    document.getElementById("kapalPCC").value = dashboardData.kapal.pcc;
    document.getElementById("kapalTotal").value = dashboardData.kapal.total;
    document.getElementById("kapalStatus").value = dashboardData.kapal.statusKapal;
    document.getElementById("kapalStatusOperasi").value = dashboardData.kapal.statusOperasi;
    document.getElementById("kapalUpdate").value = dashboardData.kapal.update;

    // Tampilkan ke kotak pratinjau hijau di bawah layar Anda
    document.getElementById("hasilAnalisa").style.display = "block";
    document.getElementById("haNama").textContent = dashboardData.kapal.nama;
    document.getElementById("haVoyage").textContent = dashboardData.kapal.voyage;
    document.getElementById("haOPC").textContent = dashboardData.kapal.opc;
    document.getElementById("haPCC").textContent = dashboardData.kapal.pcc;
    document.getElementById("haTotal").textContent = dashboardData.kapal.total;
    document.getElementById("haStatus").textContent = dashboardData.kapal.statusKapal;
    document.getElementById("haStatusOperasi").textContent = statusOperasi;
    document.getElementById("haUpdate").textContent = dashboardData.kapal.update || "-";

    alert(`HASIL PEMBACAAN BERHASIL DISINKRONKAN!`);
}

function ambilEventWA(teks){

    const baris = teks.split(/\r?\n/);

    let tanggalAktif = "";

    const events = [];

    for(const b of baris){

        const barisTrim = b.replace(/\*/g,"").trim();



    

        // ==========================
        // Deteksi tanggal
        // ==========================
        const tgl = barisTrim.match(
    /(\d{1,2})\/(\d{1,2})\/'?(\d{2,4})/
);
if(tgl){

    let tahun = tgl[3];

    if(tahun.length===2)
        tahun="20"+tahun;

    tanggalAktif =
        tahun+"-"+
        tgl[2].padStart(2,"0")+"-"+
        tgl[1].padStart(2,"0");

}

const bulan = {
    januari:"01",
    februari:"02",
    maret:"03",
    april:"04",
    mei:"05",
    juni:"06",
    juli:"07",
    agustus:"08",
    september:"09",
    oktober:"10",
    november:"11",
    desember:"12"
};

const tgl2 = barisTrim.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);

if(tgl2){

    tanggalAktif =
        tgl2[3] + "-" +
        bulan[tgl2[2].toLowerCase()] + "-" +
        tgl2[1].padStart(2,"0");

}

        // ==========================
        // Deteksi jam
        // ==========================

        const jam = barisTrim.match(/(\d{2})\.(\d{2})/);

        if(!jam) continue;

        let status = "";

        const lower = barisTrim.toLowerCase();
console.log("BARIS:", barisTrim);
        if(
    lower.includes("lanjut bongkar") &&
    lower.includes("opc")
)
    status="Sedang Bongkar OPC";

else if(
    lower.includes("start discharge") &&
    lower.includes("opc")
)
    status="Sedang Bongkar OPC";
else if(
    lower.includes("bongkaran masih berlanjut") &&
    lower.includes("opc")
)
    status="Sedang Bongkar OPC";
else if(
    lower.includes("lanjut bongkar") &&
    lower.includes("pcc")
)
    status="Sedang Bongkar PCC";

else if(
    lower.includes("start discharge") &&
    lower.includes("pcc")
)
    status="Sedang Bongkar PCC";
else if(
    lower.includes("bongkaran masih berlanjut") &&
    lower.includes("pcc")
)
    status="Sedang Bongkar PCC";
        
else if (lower.includes("selesai bongkar")) {

    status = "Selesai Bongkar";

}
else
    continue;


          console.log(barisTrim);
console.log(status);
console.log(jam);
  
console.log("BARIS =", barisTrim);
console.log("JAM =", jam);
console.log("STATUS =", status);
        events.push({
            tanggal : tanggalAktif,

            jam : jam[1]+":"+jam[2],

            datetime :
                tanggalAktif+" "+
                jam[1]+":"+jam[2],

            status : status,

            teks : barisTrim

        });

    }

    return events;
console.log(events);
}
function eventTerakhir(events){

    if(events.length===0)
        return null;

    return [...events]
        .sort((a,b)=>a.datetime.localeCompare(b.datetime))
        .at(-1);

}

function deteksiStatusKapal(teks){

    const t = teks.toLowerCase();

    // ===== BERLAYAR =====
    if(t.includes("at sea"))
        return "🚢 BERLAYAR";

    if(t.includes("berangkat tujuan"))
        return "🚢 BERLAYAR";

    if(t.includes("full away"))
        return "🚢 BERLAYAR";

    // ===== ETA =====
    const eta = t.match(/eta.*?tgl\s*([0-9\/]+).*?jam\s*([0-9:.]+)/i);

    if(eta){
        return `🚢 BERLAYAR - ETA Samarinda ${eta[1]} ${eta[2]} LT`;
    }

    // ===== MENUJU DERMAGA =====
    if(t.includes("bergerak menuju"))
        return "🚢 MENUJU DERMAGA";
if(t.includes("tug line on"))
    return "🚢 APPROACH JETTY";

    if(t.includes("tunggu info masuk alur"))
        return "⏳ MENUNGGU MASUK ALUR";

    // ===== BERLABUH =====
    if(
    t.includes("drop anchor") ||
    t.includes("letgo") ||
    t.includes("selesai berlabuh")
)
    return "⚓ BERLABUH";

    // ===== SANDAR =====
if(
    t.includes("first line") ||
    t.includes("inpost")
)
    return "🏗️ SANDAR DI JETTY PALARAN";

    return "-";
}

const EVENT_POSISI = [
  { cari: "AT SEA", status: "🚢 BERLAYAR" },
  { cari: "BERANGKAT TUJUAN", status: "🚢 BERLAYAR" },
  { cari: "FULL AWAY", status: "🚢 BERLAYAR" },
  /*{ cari: "ETA", status: "🚢 MENUJU DERMAGA" },*/
  { cari: "TUNGGU INFO MASUK ALUR", status: "⏳ MENUNGGU MASUK ALUR" },
  { cari: "DROP ANCHOR", status: "⚓ BERLABUH" },
  { cari: "LETGO", status: "⚓ BERLABUH" },
  { cari: "SELESAI BERLABUH", status: "⚓ BERLABUH" },
  { cari: "TUG LINE ON", status: "🚢 APPROACH JETTY" },
  { cari: "FIRST LINE", status: "🏗️ SANDAR DI JETTY PALARAN" },
  { cari: "INPOST", status: "🏗️ SANDAR DI JETTY PALARAN" }
];

const BANNER_KAPAL = [
  {
    cari: "TL XVIII",
    gambar: "img/tl-xviii.webp"
  },
  {
    cari: "TL XIX",
    gambar: "img/tl-xix.webp"
  },
  {
    cari: "TL XXV",
    gambar: "img/tl-xxv.webp"
  }
];

function gantiBannerKapal(namaKapal) {
    console.log("NAMA KAPAL DARI WA =", namaKapal);

    const img = document.getElementById("bannerKapal");
    if (!img) {
        console.error("Elemen #bannerKapal tidak ditemukan di HTML!");
        return;
    }

    // 1. Bersihkan nama kapal input: Hapus "KM.", ubah ke huruf besar, hapus spasi, strip, titik, dll.
    let namaBersih = (namaKapal || "").toUpperCase();
    namaBersih = namaBersih.replace("KM.", ""); // Hapus tulisan KM. jika ada
    namaBersih = namaBersih.replace(/[^A-Z0-9]/g, ""); // Hanya sisakan huruf dan angka (menjadi "TLXVIII")

    console.log("NAMA KAPAL SETELAH DI-FILTER =", namaBersih);

    // 2. Cari di BANNER_KAPAL dengan membersihkan kata kuncinya juga
    const kapal = BANNER_KAPAL.find(k => {
        const kataKunciBersih = k.cari.toUpperCase().replace(/[^A-Z0-9]/g, ""); // "TL XVIII" menjadi "TLXVIII"
        
        // Periksa apakah kata kunci ada di dalam nama kapal yang diinput
        return namaBersih.includes(kataKunciBersih);
    });

    // 3. Set gambar ke element
    img.src = kapal
        ? kapal.gambar
        : "img/tl-xviii.webp";

    console.log("GAMBAR BANNER YANG DIPASANG =", img.src);
}



function ambilEventPosisi(teks){

    const baris = teks.split(/\r?\n/);

    let tanggalAktif = "";

    const hasil = [];

    const bulan = {
        januari:"01",
        februari:"02",
        maret:"03",
        april:"04",
        mei:"05",
        juni:"06",
        juli:"07",
        agustus:"08",
        september:"09",
        oktober:"10",
        november:"11",
        desember:"12"
    };

    for(const b of baris){

        const barisTrim = b.replace(/\*/g,"").trim();

        // ===== Deteksi tanggal =====
        const tgl = barisTrim.match(/(\d{1,2})\/(\d{1,2})\/'?(\d{2,4})/);

        if(tgl){

            let tahun = tgl[3];

            if(tahun.length===2)
                tahun = "20"+tahun;

            tanggalAktif =
                tahun+"-"+
                tgl[2].padStart(2,"0")+"-"+
                tgl[1].padStart(2,"0");

        }

        const tgl2 = barisTrim.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);

        if(tgl2){

            tanggalAktif =
                tgl2[3]+"-"+
                bulan[tgl2[2].toLowerCase()]+"-"+
                tgl2[1].padStart(2,"0");

        }

        // ===== Deteksi jam =====
        const jam = barisTrim.match(/(\d{2})\.(\d{2})/);

        if(!jam) continue;

        const upper = barisTrim.toUpperCase();

        EVENT_POSISI.forEach(e=>{

            if(upper.includes(e.cari)){

                hasil.push({

                    tanggal : tanggalAktif,

                    jam : jam[1]+":"+jam[2],

                    datetime :
                        tanggalAktif+" "+
                        jam[1]+":"+jam[2],

                    event : e.cari,

                    status : e.status,

                    teks : barisTrim

                });

            }

        });

    }

    return hasil;

}

