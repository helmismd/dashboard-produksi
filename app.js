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
// VARIABEL PRODUKSI TAHUNAN
// ===========================

let tahunOPC = 0;
let tahunPCC = 0;
let tahunBag = 0;
let tahunBulk = 0;
let tahunTotal = 0; 


// ===========================
// PRODUKSI TAHUNAN
// ===========================

const tahunAktif = namaSheet.substring(6, 8);

const daftarSheetTahun = daftarSheet.filter(
    n => n.substring(6, 8) === tahunAktif
);

for (const sheetTahunan of daftarSheetTahun) {

    const wsTahunan = workbook.Sheets[sheetTahunan];

    const rowsTahunan = XLSX.utils.sheet_to_json(wsTahunan, {
        header: 1,
        defval: ""
    });

    const rTotalTahunan = cariBaris(rowsTahunan, "TOTAL PRODUKSI");
    const rPCCTahunan   = cariBaris(rowsTahunan, "Fisik Ukur SILO PCC");
    const rOPCTahunan   = cariBaris(rowsTahunan, "Fisik Ukur SILO OPC");

    if (rTotalTahunan < 0 || rPCCTahunan < 0 || rOPCTahunan < 0) continue;

    let tOPC = 0;
    let tPCC = 0;
    let tBag = 0;
    let tBulk = 0;

    for (let i = 0; i < rowsTahunan.length; i++) {

        const produk = String(rowsTahunan[i][1] || "")
            .toUpperCase()
            .trim();

        const ton = Number(rowsTahunan[i][3]) || 0;

        const hasil = {
            bag: tBag,
            bulk: tBulk,
            opc: tOPC,
            pcc: tPCC
        };

        hitungKPI(produk, ton, hasil);

        tBag  = hasil.bag;
        tBulk = hasil.bulk;
        tOPC  = hasil.opc;
        tPCC  = hasil.pcc;
    }

    tahunOPC += tOPC;
    tahunPCC += tPCC;
    tahunBag += tBag;
    tahunBulk += tBulk;
    tahunTotal += (tBag + tBulk);

}



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

async function publishDashboard() {

    if (Object.keys(dashboardData).length === 0) {
        alert("Silakan pilih file Excel terlebih dahulu.");
        return;
    }

    try {

        document.getElementById("status").textContent =
    "Mengupload ke GitHub...";

await uploadGithub();
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

// Hapus semua record dengan periode yang sama
const historyBaru = history.filter(
    item => item.periode !== dashboardData.periode
);

// Tambahkan data terbaru
historyBaru.push(dataBaru);


await uploadHistory(window.githubToken, history);

const hasilTahun = hitungTahunanHistory(
    history,
    new Date().getFullYear()
);

console.log(JSON.stringify(hasilTahun, null, 2));
console.log(JSON.stringify(history, null, 2));

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

    const token = tokenInput.value.trim();
window.githubToken = token;

    if (!token) {
        alert("Masukkan GitHub Token terlebih dahulu.");
        return;
    }

    const sha = await getGithubSHA(token);

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

    

