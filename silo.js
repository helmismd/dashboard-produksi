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

});