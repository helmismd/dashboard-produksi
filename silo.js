fetch("data.json")
.then(res => res.json())
.then(data => {

    // Last Update
    document.getElementById("lastUpdate").textContent =
        data.lastUpdate;

    // Stock OPC
    const stok = data.stokSilo.opc;

    // Kapasitas
    const kapasitas = 6000;
    const deadStock = 200;

    // Hitung %
    let persen =
        ((stok - deadStock) / (kapasitas - deadStock)) * 100;

    persen = Math.max(0, Math.min(100, persen));

    // Tampilkan data
    document.querySelector(".stock").textContent =
        stok.toFixed(2) + " Ton";

    document.querySelector(".percent").textContent =
        persen.toFixed(1) + " %";

    // Isi silo
    document.getElementById("level1").style.height =
        persen + "%";

})
.catch(err => {

    console.error(err);

    alert(err);

});