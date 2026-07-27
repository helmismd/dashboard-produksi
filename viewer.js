let chartProduksi = null;

function formatTon(nilai) {
    return Number(nilai).toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " Ton";
}

async function loadDashboard() {

    try {

        const response = await fetch("data.json");
const data = await response.json();
        console.log(data);
console.log(data.kapal);
	console.log(data.stokSilo);

        document.getElementById("periode").textContent =
            data.periode;

        document.getElementById("lastUpdate").textContent =
            data.lastUpdate;

        document.getElementById("opc").textContent =
            formatTon(data.totalOPC);

        document.getElementById("pcc").textContent =
            formatTon(data.totalPCC);

        document.getElementById("bag").textContent =
            formatTon(data.totalBag);

        document.getElementById("bulk").textContent =
            formatTon(data.totalBulk);

        document.getElementById("total").textContent =
            formatTon(data.grandTotal);

// ==========================
// PRODUKSI BULANAN
// ==========================

document.getElementById("bulanOpc").textContent =
    formatTon(data.bulanOPC);

document.getElementById("bulanPcc").textContent =
    formatTon(data.bulanPCC);

document.getElementById("bulanBag").textContent =
    formatTon(data.bulanBag);

document.getElementById("bulanBulk").textContent =
    formatTon(data.bulanBulk);

document.getElementById("bulanTotal").textContent =
    formatTon(data.bulanTotal);

// ==========================
// PRODUKSI TAHUNAN
// ==========================

document.getElementById("tahunOpc").textContent =
    formatTon(data.tahunOPC);

document.getElementById("tahunPcc").textContent =
    formatTon(data.tahunPCC);

document.getElementById("tahunBag").textContent =
    formatTon(data.tahunBag);

document.getElementById("tahunBulk").textContent =
    formatTon(data.tahunBulk);

document.getElementById("tahunTotal").textContent =
    formatTon(data.tahunTotal);

const RKAP = 659465;

const persenRKAP =
    (data.tahunTotal / RKAP) * 100;

document.getElementById("tahunRKAP").textContent =
    persenRKAP.toFixed(2) + " % RKAP";

	document.getElementById("stokOPC").textContent =
  	  formatTon(data.stokSilo.opc);

	document.getElementById("stokPCC").textContent =
   	 formatTon(data.stokSilo.pcc);

	const stokEfektif = data.stokSilo.opc + data.stokSilo.pcc;

	document.getElementById("stokEfektif").textContent =
        formatTon(stokEfektif);
     
        document.getElementById("opcPersen").textContent =
            ((data.totalOPC / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("pccPersen").textContent =
            ((data.totalPCC / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("bagPersen").textContent =
            ((data.totalBag / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("bulkPersen").textContent =
            ((data.totalBulk / data.grandTotal) * 100).toFixed(2) + " %";

// ==========================
// PERSENTASE BULANAN
// ==========================

document.getElementById("bulanOpcPersen").textContent =
    ((data.bulanOPC / data.bulanTotal) * 100).toFixed(2) + " %";

document.getElementById("bulanPccPersen").textContent =
    ((data.bulanPCC / data.bulanTotal) * 100).toFixed(2) + " %";

document.getElementById("bulanBagPersen").textContent =
    ((data.bulanBag / data.bulanTotal) * 100).toFixed(2) + " %";

document.getElementById("bulanBulkPersen").textContent =
    ((data.bulanBulk / data.bulanTotal) * 100).toFixed(2) + " %";


// ==========================
// PERSENTASE TAHUNAN
// ==========================

document.getElementById("tahunOpcPersen").textContent =
    ((data.tahunOPC / data.tahunTotal) * 100).toFixed(2) + " %";

document.getElementById("tahunPccPersen").textContent =
    ((data.tahunPCC / data.tahunTotal) * 100).toFixed(2) + " %";

document.getElementById("tahunBagPersen").textContent =
    ((data.tahunBag / data.tahunTotal) * 100).toFixed(2) + " %";

document.getElementById("tahunBulkPersen").textContent =
    ((data.tahunBulk / data.tahunTotal) * 100).toFixed(2) + " %";



      //  document.getElementById("status").textContent =
         "ONLINE";

        if (chartProduksi) {
            chartProduksi.destroy();
        } //

      //  const ctx = document.getElementById("grafikProduksi");

        chartProduksi = new Chart(ctx, {

            type: "line",

            data: {

                labels: data.labelTanggal,

                datasets: [{

                    label: "Trend Produksi Harian",

                    data: data.dataProduksi,

                    borderWidth: 4,
                    tension: 0.4,
                    pointRadius: 5,
                    fill: false

                }]

            }, //

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

    } 

    catch (err) {

        console.log(err);

        document.getElementById("status").textContent =
            "Data belum tersedia";

    }

}

loadDashboard();

setInterval(loadDashboard, 60000);

function updateJam(){

    const sekarang = new Date();

    const hari = [
        "Minggu","Senin","Selasa","Rabu",
        "Kamis","Jumat","Sabtu"
    ];

    const bulan = [
        "Januari","Februari","Maret","April",
        "Mei","Juni","Juli","Agustus",
        "September","Oktober","November","Desember"
    ];

    const teks =
        hari[sekarang.getDay()] + ", " +
        sekarang.getDate() + " " +
        bulan[sekarang.getMonth()] + " " +
        sekarang.getFullYear() + " | " +
        sekarang.toLocaleTimeString("id-ID") + " WITA";

    document.getElementById("jamDigital").textContent = teks;
}


updateJam();

setInterval(updateJam,1000);