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

    // ==========================
    // DATA OPC
    // ==========================

    const stokOPC = data.stokSilo.opc;

    let persenOPC =
        ((stokOPC - deadStock) / (kapasitas - deadStock)) * 100;

    persenOPC = Math.max(0, Math.min(100, persenOPC));

    // ==========================
    // DATA PCC
    // ==========================

    const stokPCC = data.stokSilo.pcc;

    let persenPCC =
        ((stokPCC - deadStock) / (kapasitas - deadStock)) * 100;

    persenPCC = Math.max(0, Math.min(100, persenPCC));

    // ==========================
    // TAMPILKAN OPC
    // ==========================

    document.getElementById("stockOPC").textContent =
        stokOPC.toFixed(2) + " Ton";

    document.getElementById("percentOPC").textContent =
        persenOPC.toFixed(1) + " %";

    document.getElementById("levelOPC").style.height =
        persenOPC + "%";

    // ==========================
    // TAMPILKAN PCC
    // ==========================

    document.getElementById("stockPCC").textContent =
        stokPCC.toFixed(2) + " Ton";

    document.getElementById("percentPCC").textContent =
        persenPCC.toFixed(1) + " %";

    document.getElementById("levelPCC").style.height =
        persenPCC + "%";

})
.catch(err => {

    console.error(err);

    document.getElementById("lastUpdate").textContent =
        "Gagal membaca data.json";

});