// ====================================================================
// 🟢 FILE: pcc.js - PERBAIKAN TOTAL RUMUS ASLI EXCEL SILO 2 (PCC)
// ====================================================================
function hitungVolumeSilo2(rataSilo2) {
    if (!rataSilo2 || rataSilo2 <= 0) return { volume: 0, tonase: 0 };
    
    const batasTinggi = 28.75;
    let volumeSilo = 0;
    
    // Eksekusi Rumus Asli Hasil Koreksi Excel Anda
    if (rataSilo2 <= batasTinggi) {
        volumeSilo = 5456 - (154 * rataSilo2);
    } else {
        volumeSilo = 5456 - (154 * rataSilo2) + (0.4 * Math.pow((rataSilo2 - 28.75), 3));
    }
    
    // Pengaman utama dari nilai minus di bawah nol
    if (volumeSilo < 0) volumeSilo = 0;
    
    // Kalikan dengan Faktor Kepadatan Semen PCC (LW = 1.2258)
    const isiSiloTon = volumeSilo * 1.2258;
    
    return { 
        volume: parseFloat(volumeSilo.toFixed(3)), 
        tonase: parseFloat(isiSiloTon.toFixed(3)) 
    };
}
