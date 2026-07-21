const level = document.getElementById("level1");
//
//level.style.height = "10%";
//
const stok = 5000;
const kapasitas = 6000;

const persen = (stok / kapasitas) * 100;

level.style.height = persen + "%";