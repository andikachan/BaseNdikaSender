# BaseNdikaSender — WhatsApp Bot Management Dashboard

A Cyberpunk Dark Mode Android dashboard built with **Flutter & Dart** to manage and monitor a **Baileys WhatsApp Bot** through REST API and real-time WebSockets over **Cloudflare Tunnel**.

---

## ⚡ Fitur Utama
- **Status Monitoring**: Menampilkan status online/offline, nomor WhatsApp terhubung, uptime, latency API, dan metrik tugas aktif.
- **Pairing Code Manager**: Meminta kode pairing WhatsApp 8-digit secara instan untuk menghubungkan akun baru tanpa scan QR code.
- **Safe Command Testing**: Mengirim sinyal uji coba terverifikasi ke nomor tujuan yang ditentukan dengan batas aman delay & count.
- **Reset Sesi Aman**: Menghapus sesi dan merestart koneksi Baileys secara terkontrol tanpa merusak sistem file.
- **Live Terminal Console**: Streaming log aktivitas server dan Baileys secara real-time via WebSockets dengan autoscroll dan color coding.

---

## 🌐 Konfigurasi Jaringan Produksi
- **Production REST API**: `https://botapi.ndichan.xyz` (atau `https://api.ndichan.xyz`)
- **Production WebSocket**: `wss://botapi.ndichan.xyz/ws` (atau `wss://api.ndichan.xyz/ws`)
- **Default Secret API Key**: `ndika_secret_key_2026`

---

## 📦 Build APK Manual
```bash
flutter pub get
flutter build apk --release
```
File APK hasil build akan berada di `build/app/outputs/flutter-apk/app-release.apk`.
