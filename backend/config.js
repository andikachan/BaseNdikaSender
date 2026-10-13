// ===============================================
//       ⚡ NDIKA BOT VIP - CONFIGURATION ⚡
// ===============================================
const fs = require('fs');

// Connection Settings
global.connect = true; // true = Pairing Code, false = QR Code
global.publicX = false; // Mode Self: Nonaktifkan respon publik ke chat

// Bot & Owner Identity
global.botname = "NDIKA BOT VIP";
global.ownername = "Ndika Official";
global.owner = ['6282241182487']; // Nomor Owner Utama

// Prefix Settings
global.prefa = ['', '!', '.', ',', '🐤', '🗿']; // Prefix Bot

// Sticker & Watermark Settings
global.packname = "Ndika Bot";
global.author = "Ndika Official";
global.wm = "© 2026 Ndika Official";

// Links & Channel
global.saluran = "https://chat.whatsapp.com/FPofX1sCkeBFU2EroZ4Krs";
global.linkgc = "https://chat.whatsapp.com/";
global.telegram = "https://t.me/NdikaOfficial";

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
  delete require.cache[file];
  require(file);
});