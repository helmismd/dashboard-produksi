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

// Warna Level OPC
if (stokOPC <= deadStock) {

    document.getElementById("levelOPC").style.background = "#d60000";

}
else if (persenOPC <= batasKuning) {

    document.getElementById("levelOPC").style.background = "#ffd400";

}
else {

    document.getElementById("levelOPC").style.background = "#00a651";

}

// Status OPC
const statusOPC = document.getElementById("statusOPC");

if (stokOPC <= deadStock) {

    statusOPC.textContent = "KRITIS";
    statusOPC.style.color = "#d60000";

}
else if (persenOPC <= batasKuning) {

    statusOPC.textContent = "WASPADA";
    statusOPC.style.color = "#ffd400";

}
else {

    statusOPC.textContent = "NORMAL";
    statusOPC.style.color = "#00a651";

}
    // ==========================
    // TAMPILKAN PCC
    // ==========================

    document.getElementById("stockPCC").textContent =
        stokPCC.toFixed(2) + " Ton";

    document.getElementById("percentPCC").textContent =
        persenPCC.toFixed(1) + " %";

    document.getElementById("levelPCC").style.height =
        persenPCC + "%";

// Warna Level PCC
if (stokPCC <= deadStock) {

    document.getElementById("levelPCC").style.background = "#d60000";

}
else if (persenPCC <= batasKuning) {

    document.getElementById("levelPCC").style.background = "#ffd400";

}
else {

    document.getElementById("levelPCC").style.background = "#00a651";

}

// Status PCC
const statusPCC = document.getElementById("statusPCC");

if (stokPCC <= deadStock) {

    statusPCC.textContent = "KRITIS";
    statusPCC.style.color = "#d60000";

}
else if (persenPCC <= batasKuning) {

    statusPCC.textContent = "WASPADA";
    statusPCC.style.color = "#ffd400";

}
else {

    statusPCC.textContent = "NORMAL";
    statusPCC.style.color = "#00a651";

}

})
.catch(err => {

    console.error(err);

    document.getElementById("lastUpdate").textContent =
        "Gagal membaca data.json";

});