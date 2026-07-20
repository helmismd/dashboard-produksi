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

	document.getElementById("stokOPC").textContent =
  	  formatTon(data.stokSilo.opc);

	document.getElementById("stokPCC").textContent =
   	 formatTon(data.stokSilo.pcc);

	document.getElementById("stokEfektif").textContent =
    	formatTon(data.stokSilo.efektif);

        document.getElementById("opcPersen").textContent =
            ((data.totalOPC / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("pccPersen").textContent =
            ((data.totalPCC / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("bagPersen").textContent =
            ((data.totalBag / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("bulkPersen").textContent =
            ((data.totalBulk / data.grandTotal) * 100).toFixed(2) + " %";

        document.getElementById("status").textContent =
            "ONLINE";

        if (chartProduksi) {
            chartProduksi.destroy();
        }

        const ctx = document.getElementById("grafikProduksi");

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

            },

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

console.log(teks);

updateJam();

setInterval(updateJam,1000);