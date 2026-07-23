fetch("data.json")
.then(res => res.json())
.then(data => {

    // ==========================
    // LAST UPDATE
    // ==========================

    document.getElementById("lastUpdate").textContent =
        data.lastUpdate;

    // ==========================
    // KONSTANTA
    // ==========================

    const kapasitas = 6000;
    const deadStock = 200;
    const batasKuning = 50;

    // ==========================
    // DATA SILO
    // ==========================

    const stokOPC = data.stokSilo.opc;
    const stokPCC = data.stokSilo.pcc;

    let persenOPC =
        ((stokOPC - deadStock) / (kapasitas - deadStock)) * 100;

    let persenPCC =
        ((stokPCC - deadStock) / (kapasitas - deadStock)) * 100;

    persenOPC = Math.max(0, Math.min(100, persenOPC));
    persenPCC = Math.max(0, Math.min(100, persenPCC));

    // ==========================
    // TAMPILKAN OPC
    // ==========================

    document.getElementById("stockOPC").textContent =
        stokOPC.toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " Ton";

    document.getElementById("percentOPC").textContent =
        persenOPC.toFixed(1) + " %";

    document.getElementById("levelOPC").style.height =
        persenOPC + "%";

    const statusOPC = document.getElementById("statusOPC");

    if (stokOPC <= deadStock) {

        document.getElementById("levelOPC").style.background = "#d60000";
        statusOPC.textContent = "KRITIS";
        statusOPC.style.color = "#d60000";

    } else if (persenOPC <= batasKuning) {

        document.getElementById("levelOPC").style.background = "#ffd400";
        statusOPC.textContent = "WASPADA";
        statusOPC.style.color = "#ffd400";

    } else {

        document.getElementById("levelOPC").style.background = "#00a651";
        statusOPC.textContent = "NORMAL";
        statusOPC.style.color = "#00a651";

    }

    // ==========================
    // TAMPILKAN PCC
    // ==========================

    document.getElementById("stockPCC").textContent =
        stokPCC.toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " Ton";

    document.getElementById("percentPCC").textContent =
        persenPCC.toFixed(1) + " %";

    document.getElementById("levelPCC").style.height =
        persenPCC + "%";

    const statusPCC = document.getElementById("statusPCC");

    if (stokPCC <= deadStock) {

        document.getElementById("levelPCC").style.background = "#d60000";
        statusPCC.textContent = "KRITIS";
        statusPCC.style.color = "#d60000";

    } else if (persenPCC <= batasKuning) {

        document.getElementById("levelPCC").style.background = "#ffd400";
        statusPCC.textContent = "WASPADA";
        statusPCC.style.color = "#ffd400";

    } else {

        document.getElementById("levelPCC").style.background = "#00a651";
        statusPCC.textContent = "NORMAL";
        statusPCC.style.color = "#00a651";

    }

    // ==========================
    // DATA KAPAL
    // ==========================

    if (data.kapal) {

        const kapal = data.kapal;

        const sisaMuatan =
            kapal.muatanAwal - kapal.terbongkar;

        document.getElementById("shipName").textContent =
            kapal.nama;

        document.getElementById("shipProduct").textContent =
            kapal.produk;

        document.getElementById("shipCargo").textContent =
            kapal.muatanAwal.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " Ton";

        document.getElementById("shipUnload").textContent =
            kapal.terbongkar.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " Ton";

        document.getElementById("shipRemain").textContent =
            sisaMuatan.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " Ton";

        document.getElementById("shipSilo").textContent =
            kapal.tujuanSilo;

        document.getElementById("shipStatus").textContent =
            kapal.status;

    }

})
.catch(err => {

    console.error(err);

    document.getElementById("lastUpdate").textContent =
        "Gagal membaca data.json";

});