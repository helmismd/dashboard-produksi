// ====================================================================
// 🟢 FILE: opc.js - LOGIKA MATEMATIKA RUMUS KALIBRASI EXCEL SILO 1 (OPC)
// ====================================================================

/**
 * Fungsi untuk menghitung volume dan berat tonase Semen OPC (Silo 1)
 * @param {number} rataSilo1 - Hasil rata-rata sounding meteran dari operator
 * @return {object} Objek berisi hasil volume (m3) dan isi silo murni (Ton)
 */
function hitungVolumeSilo1(rataSilo1) {
    if (!rataSilo1 || rataSilo1 <= 0) {
        return { volume: 0, tonase: 0 };
    }

    const batasTinggi = 27.25;
    let volumeSilo = 0;

    // 1. Eksekusi Rumus Kondisional Excel Sesuai Batas Tinggi (Threshold)
    if (rataSilo1 <= batasTinggi) {
        // Rumus Excel asli Anda saat tinggi <= 27.25
        volumeSilo = 5226 - (154 * rataSilo1);
    } else {
        // Rumus Koreksi Kerucut Bawah Excel Anda saat tinggi > 27.25
        volumeSilo = 5226 - (154 * rataSilo1) + (0.4 * Math.pow((rataSilo1 - 27.25), 3));
    }

    // Amankan agar angka volume tidak menghasilkan nilai minus di bawah nol
    if (volumeSilo < 0) volumeSilo = 0;

    // 2. Kalikan dengan Faktor Kepadatan Semen OPC (LW = 1.2751)
    const isiSiloTon = volumeSilo * 1.2751;

    console.log(`[CALCULATOR OPC] Rata: ${rataSilo1}m | Volume: ${volumeSilo.toFixed(3)} m3 | Hasil Akhir: ${isiSiloTon.toFixed(3)} Ton`);

    return {
        volume: parseFloat(volumeSilo.toFixed(3)),
        tonase: parseFloat(isiSiloTon.toFixed(3))
    };
}
// ====================================================================
