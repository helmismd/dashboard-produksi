// ====================================================================
// 🟢 FILE: pcc.js - LOGIKA MATEMATIKA RUMUS KALIBRASI EXCEL SILO 2 (PCC)
// ====================================================================
function hitungVolumeSilo2(rataSilo2) {
    if (!rataSilo2 || rataSilo2 <= 0) return { volume: 0, tonase: 0 };
    const batasTinggi = 28.75;
    let volumeSilo = 0;
    
    // Eksekusi rumus sesuai 2 foto Excel Anda
    if (rataSilo2 <= batasTinggi) {
        volumeSilo = 32.806 - (7.675 * rataSilo2);
    } else {
        volumeSilo = 32.806 - (7.675 * rataSilo2) + (0.3532 * Math.pow((5.884 - rataSilo2), 3));
    }
    
    if (volumeSilo < 0) volumeSilo = 0;
    const isiSiloTon = volumeSilo * 1.2258; // Faktor Kepadatan PCC
    
    return { volume: volumeSilo, tonase: isiSiloTon };
}
