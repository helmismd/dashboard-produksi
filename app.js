// ======================================================
// DASHBOARD PRODUKSI PACKING PLANT SAMARINDA
// APP.JS V2.0
// ======================================================

let chartProduksi = null;
let dashboardData = {};

function formatTon(nilai) {
    return Number(nilai).toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " Ton";
}

document
    .getElementById("excelFile")
    .addEventListener("change", bacaExcel);

function bacaExcel(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (evt) {

        const data = new Uint8Array(evt.target.result);

        const workbook = XLSX.read(data, {
            type: "array"
        });

        const sheet = workbook.Sheets["Release Semen"];

        if (!sheet) {
            alert("Sheet Release Semen tidak ditemukan.");
            return;
        }

        const json = XLSX.utils.sheet_to_json(sheet);

        if (json.length === 0) {
            alert("Data kosong.");
            return;
        }

        // ===========================
        // Variabel Akumulasi
        // ===========================

        let totalOPC = 0;
        let totalPCC = 0;
        let totalBag = 0;
        let totalBulk = 0;
        let grandTotal = 0;

        const labelTanggal = [];
        const dataProduksi = [];

        json.forEach(function (baris) {

            totalOPC += Number(baris["Total OPC (ton)"]) || 0;
            totalPCC += Number(baris["Total PCC (ton)"]) || 0;
            totalBag += Number(baris["Total Bag"]) || 0;
            totalBulk += Number(baris["Total Bulk"]) || 0;
            grandTotal += Number(baris["Grand Total"]) || 0;

            labelTanggal.push(
                XLSX.SSF.format(
                    "dd/MM",
                    baris["Tanggal"]
                )
            );

            dataProduksi.push(
                Number(baris["Grand Total"]) || 0
            );

        });

        // ===========================
        // Data terakhir
        // ===========================

        const last = json[json.length - 1];

        const nomorTanggal = last["Tanggal"];

        const tanggal =
            XLSX.SSF.format(
                "dd/mm/yyyy",
                nomorTanggal
            );

        const bagian = tanggal.split("/");

        const hari = bagian[0];
        const bulanKe = Number(bagian[1]) - 1;
        const tahun = bagian[2];

        const namaBulan = [
            "JANUARI",
            "FEBRUARI",
            "MARET",
            "APRIL",
            "MEI",
            "JUNI",
            "JULI",
            "AGUSTUS",
            "SEPTEMBER",
            "OKTOBER",
            "NOVEMBER",
            "DESEMBER"
        ];

        // ===========================
        // Periode Dashboard
        // ===========================

        document.getElementById("periode").textContent =
            `01-${hari} ${namaBulan[bulanKe]} ${tahun}`;

        document.getElementById("lastUpdate").textContent =
            `Data terakhir diperbarui : ${hari} ${namaBulan[bulanKe]} ${tahun}`;

        // ===========================
        // KPI Produksi
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
        // Persentase KPI
        // ===========================

        const persenOPC =
            grandTotal === 0 ? 0 :
            (totalOPC / grandTotal) * 100;

        const persenPCC =
            grandTotal === 0 ? 0 :
            (totalPCC / grandTotal) * 100;

        const persenBag =
            grandTotal === 0 ? 0 :
            (totalBag / grandTotal) * 100;

        const persenBulk =
            grandTotal === 0 ? 0 :
            (totalBulk / grandTotal) * 100;

        document.getElementById("opcPersen").textContent =
            persenOPC.toFixed(2) + " %";

        document.getElementById("pccPersen").textContent =
            persenPCC.toFixed(2) + " %";

        document.getElementById("bagPersen").textContent =
            persenBag.toFixed(2) + " %";

        document.getElementById("bulkPersen").textContent =
            persenBulk.toFixed(2) + " %";

        // ===========================
        // Status
        // ===========================

        document.getElementById("status").textContent =
            "Data berhasil dimuat";

        // ===========================
        // Dashboard Data
        // ===========================

        dashboardData = {
            periode: document.getElementById("periode").textContent,
            lastUpdate: document.getElementById("lastUpdate").textContent,

            totalOPC: totalOPC,
            totalPCC: totalPCC,
            totalBag: totalBag,
            totalBulk: totalBulk,
            grandTotal: grandTotal,

            labelTanggal: labelTanggal,
            dataProduksi: dataProduksi
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

                labels: labelTanggal,

                datasets: [{

                    label: "Trend Produksi Harian",

                    data: dataProduksi,

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

        const fileHandle = await window.showSaveFilePicker({

            suggestedName: "data.json",

            types: [{
                description: "JSON File",
                accept: {
                    "application/json": [".json"]
                }
            }]

        });

        const writable =
            await fileHandle.createWritable();

        await writable.write(
            JSON.stringify(dashboardData, null, 2)
        );

        await writable.close();

        alert("✅ Dashboard berhasil dipublish.");

    }
    catch (err) {

        if (err.name !== "AbortError") {
            console.error(err);
            alert("Publish gagal.");
        }

    }

}