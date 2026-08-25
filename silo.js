

fetch("https://worker-produksi.helmi-2573er.workers.dev/api/silo", {
    credentials: "include"
})
/*fetch("data.json")*/
.then(response => response.json())
.then(data => {

    // ==========================
    // LAST UPDATE
    // ==========================
    document.getElementById("lastUpdate").textContent = data.lastUpdate;
document.getElementById("periode").textContent =
"Periode : " + data.periode;

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
    // ==========================
// DATA SILO
// ==========================
tampilkanSilo(data.stokSilo.opc,"OPC");
tampilkanSilo(data.stokSilo.pcc,"PCC");
    
    // ==========================
// DATA KAPAL
// ==========================

if(data.kapal){

    const kapal = data.kapal;

    document.getElementById("shipName").textContent =
        kapal.nama;

    document.getElementById("shipProduct").textContent =
        kapal.voyage;

    document.getElementById("shipCargo").textContent =
        kapal.opc;

    document.getElementById("shipUnload").textContent =
        kapal.pcc;

    document.getElementById("shipRemain").textContent =
        kapal.total;

    document.getElementById("shipSilo").textContent =
        kapal.statusKapal;

    document.getElementById("shipStatus").textContent =
        kapal.statusOperasi;

}else{

    document.getElementById("shipName").textContent = "-";
    document.getElementById("shipProduct").textContent = "-";
    document.getElementById("shipCargo").textContent = "-";
    document.getElementById("shipUnload").textContent = "-";
    document.getElementById("shipRemain").textContent = "-";
    document.getElementById("shipSilo").textContent = "-";
    document.getElementById("shipStatus").textContent = "TIDAK ADA KAPAL";

}

})
.catch(error=>{

    console.error(error);

    document.getElementById("lastUpdate").textContent =
        "Gagal membaca data.json";

});
