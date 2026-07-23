fetch("data.json")
.then(response => response.json())
.then(data => {
console.log(data);
    // ==========================
    // LAST UPDATE
    // ==========================
    document.getElementById("lastUpdate").textContent = data.lastUpdate;

    // ==========================
    // KONSTANTA
    // ==========================
    const kapasitas = 6000;
    const deadStock = 200;
    const batasWaspada = 50;

    // ==========================
    // FUNGSI TAMPILKAN SILO
    // ==========================
    function tampilkanSilo(stok, prefix){

        let persen = ((stok - deadStock) / (kapasitas - deadStock)) * 100;

        persen = Math.max(0, Math.min(100, persen));

        document.getElementById("stock" + prefix).textContent =
            stok.toLocaleString("id-ID",{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }) + " Ton";

        document.getElementById("percent" + prefix).textContent =
            persen.toFixed(1) + " %";

        document.getElementById("level" + prefix).style.height =
            persen + "%";

        const level = document.getElementById("level" + prefix);
        const status = document.getElementById("status" + prefix);

        if(stok <= deadStock){

            level.style.background="#d60000";
            status.textContent="KRITIS";
            status.style.color="#d60000";

        }
        else if(persen <= batasWaspada){

            level.style.background="#ffd400";
            status.textContent="WASPADA";
            status.style.color="#ffd400";

        }
        else{

            level.style.background="#00a651";
            status.textContent="NORMAL";
            status.style.color="#00a651";

        }

    }

    // ==========================
    // DATA SILO
    // ==========================
    tampilkanSilo(data.totalOPC,"OPC");
    tampilkanSilo(data.totalPCC,"PCC");

    // ==========================
    // DATA KAPAL
    // ==========================
    if(data.kapal){

        const kapal = data.kapal;

        const sisa =
            kapal.muatanAwal - kapal.terbongkar;

        document.getElementById("shipName").textContent =
            kapal.nama;

        document.getElementById("shipProduct").textContent =
            kapal.produk;

        document.getElementById("shipCargo").textContent =
            kapal.muatanAwal.toLocaleString("id-ID") + " Ton";

        document.getElementById("shipUnload").textContent =
            kapal.terbongkar.toLocaleString("id-ID") + " Ton";

        document.getElementById("shipRemain").textContent =
            sisa.toLocaleString("id-ID") + " Ton";

        document.getElementById("shipSilo").textContent =
            kapal.tujuanSilo;

        document.getElementById("shipStatus").textContent =
            kapal.status;

    }

})
.catch(error=>{

    console.error(error);

    document.getElementById("lastUpdate").textContent =
        "Gagal membaca data.json";

});