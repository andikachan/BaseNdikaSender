/**
 * ============================================================================
 *                    ⚡ NDIKA BOT MANAGEMENT API BRIDGE ⚡
 *          REST API & WebSocket Bridge for Baileys WhatsApp Bot
 * ============================================================================
 * File: api_bridge.js
 * Deskripsi:
 * Modul jembatan yang menyediakan REST API & WebSocket server untuk mengelola
 * instance Baileys WhatsApp bot (monitoring status, pairing code, reset session,
 * dan eksekusi command pengujian) secara modular tanpa merusak event handler bot.
 */

const http = require("http");
const express = require("express");
const cors = require("cors");
const { WebSocketServer, WebSocket } = require("ws");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Load .env jika tersedia
try {
  require("dotenv").config();
} catch (e) {
  // dotenv opsional
}

// Import Engine Fungsi Sender Lengkap
const senderEngine = require("./lib/sender_functions");

// ============================================================================
// KONFIGURASI SISTEM
// ============================================================================
const CONFIG = {
  PORT: parseInt(process.env.PORT, 10) || 25566,
  API_KEY: process.env.API_KEY || "ndika_secret_key_2026",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  SESSION_DIR: path.resolve(__dirname, process.env.SESSION_DIR || "./session"),
  PING_INTERVAL_MS: 20000, // 20 detik untuk heartbeat WebSocket
  MAX_TEST_COUNT: 100,
  MIN_DELAY_MS: 50,
  MAX_DELAY_MS: 10000
};

// ============================================================================
// RESPONSE FORMATTER STANDAR
// ============================================================================
function successResponse(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function errorResponse(res, message, errorCode = "INTERNAL_ERROR", statusCode = 500, details = null) {
  const payload = {
    success: false,
    message,
    error: {
      code: errorCode
    }
  };
  if (details) {
    payload.error.details = details;
  }
  return res.status(statusCode).json(payload);
}

// ============================================================================
// LOG SANITIZER & CENTRALIZED LOGGER
// ============================================================================
// Menghapus data sensitif (token, session hash, private keys) sebelum broadcast
function sanitizeMessage(text) {
  if (typeof text !== "string") {
    try {
      text = JSON.stringify(text);
    } catch {
      text = String(text);
    }
  }
  return text
    .replace(/(bearer\s+)[a-zA-Z0-9_\-\.]{15,}/gi, "$1[REDACTED]")
    .replace(/([?&]key=)[a-zA-Z0-9_\-\.]+/gi, "$1[REDACTED]")
    .replace(/("key":\s*")[^"]+(")/gi, '$1[REDACTED]$2')
    .replace(/("mac":\s*")[^"]+(")/gi, '$1[REDACTED]$2')
    .replace(/("encKey":\s*")[^"]+(")/gi, '$1[REDACTED]$2');
}

class CentralLogger {
  constructor() {
    this.wsServer = null;
  }

  setWsServer(wss) {
    this.wsServer = wss;
  }

  broadcast(level, message, meta = null) {
    const cleanMsg = sanitizeMessage(message);
    const timestamp = new Date().toISOString();

    // Cetak ke terminal server dengan chalk
    let coloredTag = chalk.cyan("[INFO]");
    if (level === "error") coloredTag = chalk.red("[ERROR]");
    else if (level === "warn" || level === "warning") coloredTag = chalk.yellow("[WARN]");
    else if (level === "success") coloredTag = chalk.green("[SUCCESS]");

    console.log(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${coloredTag} ${cleanMsg}`);

    // Broadcast ke seluruh WebSocket client terautentikasi
    if (this.wsServer) {
      const payload = JSON.stringify({
        type: "log",
        timestamp,
        level: level === "warning" ? "warn" : level,
        message: cleanMsg,
        data: meta || undefined
      });

      this.wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
          client.send(payload);
        }
      });
    }
  }

  info(msg, meta) { this.broadcast("info", msg, meta); }
  warn(msg, meta) { this.broadcast("warn", msg, meta); }
  error(msg, meta) { this.broadcast("error", msg, meta); }
  success(msg, meta) { this.broadcast("success", msg, meta); }
}

const logger = new CentralLogger();

// ============================================================================
// BOT LIFECYCLE MANAGER
// ============================================================================
class BotLifecycleManager {
  constructor() {
    this.sock = null;
    this.reconnectCallback = null;
    this.connectionState = "disconnected"; // disconnected, connecting, connected
    this.lastDisconnectReason = null;
    this.connectedAt = null;
    this.isResetting = false;
    this.activeCommandsCount = 0;
  }

  setSocket(sockInstance, reconnectCallback) {
    this.sock = sockInstance;
    if (reconnectCallback) {
      this.reconnectCallback = reconnectCallback;
    }
    logger.info("Bot instance Baileys terdaftar di API Bridge Lifecycle Manager.");
  }

  handleConnectionUpdate(update) {
    const { connection, lastDisconnect } = update;

    if (connection) {
      this.connectionState = connection;
    }

    if (connection === "open") {
      this.connectionState = "connected";
      this.connectedAt = new Date();
      this.lastDisconnectReason = null;
      logger.success(`Bot WhatsApp terhubung sebagai: ${this.getBotNumber() || "Unknown"}`);
      this.broadcastStatus();
    } else if (connection === "close") {
      this.connectionState = "disconnected";
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const errorMsg = lastDisconnect?.error?.message || "Connection closed";
      this.lastDisconnectReason = `Status ${statusCode || "unknown"}: ${errorMsg}`;
      logger.warn(`Koneksi WhatsApp terputus: ${this.lastDisconnectReason}`);
      this.broadcastStatus();
    } else if (connection === "connecting") {
      this.connectionState = "connecting";
      logger.info("Sedang menghubungkan ke WhatsApp...");
      this.broadcastStatus();
    }
  }

  broadcastStatus() {
    if (!logger.wsServer) return;
    const statusPayload = JSON.stringify({
      type: "connection_status",
      timestamp: new Date().toISOString(),
      data: this.getStatusInfo()
    });

    logger.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
        client.send(statusPayload);
      }
    });
  }

  getBotNumber() {
    if (!this.sock || !this.sock.user) return null;
    const id = this.sock.user.id || "";
    // Format id Baileys: 62812345678:0@s.whatsapp.net
    return id.split("@")[0].split(":")[0] || null;
  }

  getBotName() {
    if (!this.sock || !this.sock.user) return global.botname || "WhatsApp Bot";
    return this.sock.user.name || global.botname || "WhatsApp Bot";
  }

  isRegistered() {
    return Boolean(this.sock?.authState?.creds?.registered);
  }

  getStatusInfo() {
    const isOnline = this.connectionState === "connected" && Boolean(this.sock?.user);
    const uptimeSec = this.connectedAt && isOnline
      ? Math.floor((Date.now() - this.connectedAt.getTime()) / 1000)
      : Math.floor(process.uptime());

    const sessionExists = fs.existsSync(path.join(CONFIG.SESSION_DIR, "creds.json"));

    return {
      online: isOnline,
      connectionState: this.connectionState,
      phoneNumber: this.getBotNumber(),
      botName: this.getBotName(),
      authenticated: this.isRegistered(),
      sessionExists: sessionExists,
      uptimeSeconds: uptimeSec,
      serverTime: new Date().toISOString(),
      lastDisconnectReason: this.lastDisconnectReason,
      isResetting: this.isResetting,
      activeCommandsCount: this.activeCommandsCount
    };
  }

  /**
   * Meminta pairing code melalui Baileys secara aman.
   */
  async requestPairingCode(phoneNumber, customCode = "NDIKA123") {
    if (!this.sock) {
      throw {
        statusCode: 503,
        code: "BOT_NOT_INITIALIZED",
        message: "Instance bot WhatsApp belum diinisialisasi di server."
      };
    }

    if (this.isResetting) {
      throw {
        statusCode: 409,
        code: "SESSION_RESET_IN_PROGRESS",
        message: "Sesi bot sedang direset. Tunggu proses selesai."
      };
    }

    if (this.isRegistered()) {
      throw {
        statusCode: 409,
        code: "ALREADY_REGISTERED",
        message: "Bot sudah terautentikasi dan memiliki sesi aktif. Hapus sesi terlebih dahulu jika ingin pairing ulang."
      };
    }

    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (!cleanNumber || cleanNumber.length < 8 || cleanNumber.length > 15) {
      throw {
        statusCode: 400,
        code: "INVALID_PHONE_NUMBER",
        message: "Nomor telepon tidak valid. Gunakan format internasional (contoh: 6281234567890)."
      };
    }

    logger.info(`Memproses permintaan pairing code untuk nomor: ${cleanNumber}`);

    try {
      const code = await this.sock.requestPairingCode(cleanNumber, customCode);
      logger.success(`Pairing code berhasil dibuat untuk ${cleanNumber}: ${code}`);
      return {
        phoneNumber: cleanNumber,
        pairingCode: code,
        expiresInSeconds: 60
      };
    } catch (err) {
      logger.error(`Gagal membuat pairing code: ${err.message || err}`);
      throw {
        statusCode: 500,
        code: "PAIRING_CODE_ERROR",
        message: `Gagal menghasilkan pairing code dari server WhatsApp: ${err.message || "Unknown error"}`
      };
    }
  }

  /**
   * Reset sesi bot secara aman:
   * 1. Validasi tidak ada command berjalan
   * 2. Set status resetting
   * 3. Tutup koneksi WebSocket Baileys secara terkontrol
   * 4. Hapus folder session setelah file release
   * 5. Panggil reconnectCallback untuk inisialisasi socket baru
   */
  async resetSession() {
    if (this.isResetting) {
      throw {
        statusCode: 409,
        code: "RESET_ALREADY_IN_PROGRESS",
        message: "Operasi reset sesi sedang berlangsung."
      };
    }

    if (this.activeCommandsCount > 0) {
      throw {
        statusCode: 409,
        code: "COMMAND_ACTIVE",
        message: `Tidak dapat mereset sesi saat ada ${this.activeCommandsCount} perintah pengujian yang sedang berjalan.`
      };
    }

    this.isResetting = true;
    logger.warn("Memulai proses penghapusan sesi dan restart bot terkontrol...");

    try {
      // 1. Tutup koneksi socket yang lama jika ada
      if (this.sock) {
        try {
          if (this.sock.ws && typeof this.sock.ws.close === "function") {
            this.sock.ws.close();
          }
          if (typeof this.sock.end === "function") {
            this.sock.end(new Error("Manual session reset requested"));
          }
        } catch (sockCloseErr) {
          logger.warn(`Catatan penutupan socket: ${sockCloseErr.message}`);
        }
      }

      // 2. Beri jeda 1 detik agar handle file pada multi-file auth tertutup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Hapus folder ./session secara rekursif
      if (fs.existsSync(CONFIG.SESSION_DIR)) {
        fs.rmSync(CONFIG.SESSION_DIR, { recursive: true, force: true });
        logger.info(`Folder sesi dihapus: ${CONFIG.SESSION_DIR}`);
      }

      this.connectionState = "disconnected";
      this.connectedAt = null;
      this.lastDisconnectReason = "Manual reset requested via API";
      this.broadcastStatus();

      // 4. Inisialisasi ulang koneksi WhatsApp
      if (typeof this.reconnectCallback === "function") {
        logger.info("Menginisialisasi ulang koneksi WhatsApp setelah reset sesi...");
        setTimeout(() => {
          this.reconnectCallback();
          this.isResetting = false;
        }, 1500);
      } else {
        this.isResetting = false;
      }

      return {
        resetAt: new Date().toISOString(),
        sessionCleared: true,
        reconnecting: typeof this.reconnectCallback === "function"
      };
    } catch (err) {
      this.isResetting = false;
      logger.error(`Gagal mereset sesi: ${err.message || err}`);
      throw {
        statusCode: 500,
        code: "SESSION_DELETE_FAILED",
        message: `Gagal menghapus folder sesi: ${err.message || err}`
      };
    }
  }

  /**
   * Eksekusi fungsi sender atau perintah pengujian bot
   */
  async executeTestCommand({ target, command, count = 1, delayMs = 1000 }) {
    if (!this.sock || this.connectionState !== "connected" || !this.isRegistered()) {
      throw {
        statusCode: 503,
        code: "BOT_NOT_CONNECTED",
        message: "Bot WhatsApp tidak sedang terhubung atau belum login."
      };
    }

    const foundCmd = senderEngine.findCommand(command);
    if (!foundCmd) {
      throw {
        statusCode: 400,
        code: "INVALID_COMMAND",
        message: `Perintah '${command}' tidak ditemukan. Gunakan endpoint GET /api/commands untuk melihat seluruh katalog perintah sender yang tersedia.`
      };
    }

    const cleanTarget = String(target).trim();
    if (!cleanTarget || cleanTarget.length < 5) {
      throw {
        statusCode: 400,
        code: "INVALID_TARGET",
        message: "Target tidak valid. Masukkan nomor WhatsApp atau link / ID grup."
      };
    }

    const sanitizedCount = Math.min(Math.max(parseInt(count, 10) || 1, 1), CONFIG.MAX_TEST_COUNT);
    const sanitizedDelay = Math.min(Math.max(parseInt(delayMs, 10) || 1000, CONFIG.MIN_DELAY_MS), CONFIG.MAX_DELAY_MS);

    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.activeCommandsCount++;

    logger.info(`Memulai eksekusi '${foundCmd.name}' (${foundCmd.id}) ke ${cleanTarget} [Jumlah: ${sanitizedCount}, Delay: ${sanitizedDelay}ms, ID: ${commandId}]`);

    // Broadcast WebSocket event: command_started
    if (logger.wsServer) {
      const startPayload = JSON.stringify({
        type: "command_started",
        timestamp: new Date().toISOString(),
        data: {
          commandId,
          target: cleanTarget,
          command: foundCmd.id,
          commandName: foundCmd.name,
          category: foundCmd.category,
          count: sanitizedCount,
          delayMs: sanitizedDelay
        }
      });
      logger.wsServer.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN && c.isAuthenticated) c.send(startPayload);
      });
    }

    // Jalankan secara asynchronous di background
    (async () => {
      try {
        await senderEngine.executeSenderCommand(this.sock, {
          command: foundCmd.id,
          target: cleanTarget,
          count: sanitizedCount,
          delayMs: sanitizedDelay,
          logger,
          onProgress: (msg) => {
            logger.info(`[${commandId}] ${msg}`);
          }
        });

        logger.success(`Perintah '${foundCmd.name}' selesai dengan sukses! [ID: ${commandId}]`);

        // Broadcast WebSocket event: command_completed
        if (logger.wsServer) {
          const completedPayload = JSON.stringify({
            type: "command_completed",
            timestamp: new Date().toISOString(),
            data: {
              commandId,
              target: cleanTarget,
              command: foundCmd.id,
              commandName: foundCmd.name,
              totalSent: sanitizedCount,
              status: "success"
            }
          });
          logger.wsServer.clients.forEach((c) => {
            if (c.readyState === WebSocket.OPEN && c.isAuthenticated) c.send(completedPayload);
          });
        }
      } catch (err) {
        logger.error(`Eksekusi command '${foundCmd.name}' gagal: ${err.message || err} [ID: ${commandId}]`);

        // Broadcast WebSocket event: command_failed
        if (logger.wsServer) {
          const failedPayload = JSON.stringify({
            type: "command_failed",
            timestamp: new Date().toISOString(),
            data: {
              commandId,
              target: cleanTarget,
              command: foundCmd.id,
              commandName: foundCmd.name,
              error: err.message || "Gagal mengeksekusi fungsi sender",
              status: "failed"
            }
          });
          logger.wsServer.clients.forEach((c) => {
            if (c.readyState === WebSocket.OPEN && c.isAuthenticated) c.send(failedPayload);
          });
        }
      } finally {
        this.activeCommandsCount = Math.max(0, this.activeCommandsCount - 1);
      }
    })();

    return {
      commandId,
      target: cleanTarget,
      command: foundCmd.id,
      commandName: foundCmd.name,
      category: foundCmd.category,
      count: sanitizedCount,
      delayMs: sanitizedDelay,
      status: "queued_and_running"
    };
  }
}

const lifecycleManager = new BotLifecycleManager();

// ============================================================================
// RATE LIMITER MIDDLEWARE (IN-MEMORY)
// ============================================================================
const rateLimitBuckets = new Map();

function rateLimiter({ windowMs = 60000, max = 60, message = "Terlalu banyak permintaan, coba lagi nanti." }) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || "global";
    const now = Date.now();

    if (!rateLimitBuckets.has(ip)) {
      rateLimitBuckets.set(ip, []);
    }

    const timestamps = rateLimitBuckets.get(ip).filter((time) => now - time < windowMs);
    rateLimitBuckets.set(ip, timestamps);

    if (timestamps.length >= max) {
      return errorResponse(res, message, "RATE_LIMIT_EXCEEDED", 429, {
        retryAfterMs: windowMs - (now - timestamps[0])
      });
    }

    timestamps.push(now);
    next();
  };
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
function authenticateApiKey(req, res, next) {
  // Dukung token dari header 'x-api-key', 'Authorization: Bearer <token>', atau query '?key=<token>'
  const headerKey = req.headers["x-api-key"];
  const authHeader = req.headers["authorization"];
  let bearerKey = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    bearerKey = authHeader.substring(7).trim();
  }
  const queryKey = req.query.key;

  const providedKey = headerKey || bearerKey || queryKey;

  if (!providedKey) {
    return errorResponse(res, "Autentikasi gagal: API key wajib disertakan.", "UNAUTHORIZED", 401);
  }

  if (providedKey !== CONFIG.API_KEY) {
    logger.warn(`Percobaan akses dengan API key tidak valid dari IP: ${req.ip || "unknown"}`);
    return errorResponse(res, "Autentikasi gagal: API key tidak valid.", "FORBIDDEN", 403);
  }

  next();
}

// ============================================================================
// EXPRESS APP CONFIGURATION
// ============================================================================
const app = express();

// Parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CONFIG.CORS_ORIGIN === "*" || origin === CONFIG.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error("Origin tidak diizinkan oleh CORS."));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
  })
);

// General rate limiter: 60 request / menit
app.use(rateLimiter({ windowMs: 60000, max: 60 }));

// Middleware pelacak latensi
app.use((req, res, next) => {
  req._startTime = Date.now();
  next();
});

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

/**
 * 1. GET /mySender
 * Monitoring bot: status koneksi, nomor bot, latensi, uptime
 */
app.get("/mySender", authenticateApiKey, (req, res) => {
  const latencyMs = Date.now() - req._startTime;
  const statusInfo = lifecycleManager.getStatusInfo();

  return successResponse(
    res,
    "Status bot berhasil diperoleh.",
    {
      ...statusInfo,
      latencyMs
    },
    200
  );
});

/**
 * 2. POST /getPairing
 * Meminta pairing code untuk nomor WhatsApp baru
 */
app.post(
  "/getPairing",
  authenticateApiKey,
  rateLimiter({ windowMs: 60000, max: 10, message: "Terlalu banyak permintaan pairing code. Silakan tunggu 1 menit." }),
  async (req, res) => {
    try {
      const phoneNumber = req.body?.phoneNumber || req.query?.number || req.query?.phoneNumber;
      const customCode = req.body?.customCode || "NDIKA123";

      if (!phoneNumber) {
        return errorResponse(res, "Parameter 'phoneNumber' wajib diisi.", "MISSING_PARAMETER", 400);
      }

      const result = await lifecycleManager.requestPairingCode(phoneNumber, customCode);
      return successResponse(res, "Kode pairing WhatsApp berhasil dibuat.", result, 200);
    } catch (err) {
      const status = err.statusCode || 500;
      const code = err.code || "PAIRING_FAILED";
      const message = err.message || "Gagal membuat pairing code.";
      return errorResponse(res, message, code, status);
    }
  }
);

/**
 * 3. POST /deleteSender
 * Manajemen sesi: Menghapus sesi lama dan menginisialisasi ulang bot
 */
app.post(
  "/deleteSender",
  authenticateApiKey,
  rateLimiter({ windowMs: 60000, max: 5, message: "Terlalu sering melakukan reset sesi. Silakan tunggu." }),
  async (req, res) => {
    try {
      const result = await lifecycleManager.resetSession();
      return successResponse(res, "Sesi bot berhasil dihapus dan bot di-restart.", result, 200);
    } catch (err) {
      const status = err.statusCode || 500;
      const code = err.code || "SESSION_RESET_FAILED";
      const message = err.message || "Gagal mereset sesi bot.";
      return errorResponse(res, message, code, status);
    }
  }
);

/**
 * 4. POST /api/send-command
 * Eksekusi perintah pengujian aman
 */
app.post("/api/send-command", authenticateApiKey, async (req, res) => {
  try {
    const { target, command = "test-message", count = 1, delayMs = 1000 } = req.body;

    if (!target) {
      return errorResponse(res, "Parameter 'target' (nomor WhatsApp tujuan) wajib diisi.", "MISSING_TARGET", 400);
    }

    const result = await lifecycleManager.executeTestCommand({ target, command, count, delayMs });
    return successResponse(res, "Perintah pengujian berhasil dijadwalkan dan mulai dieksekusi.", result, 200);
  } catch (err) {
    const status = err.statusCode || 500;
    const code = err.code || "COMMAND_EXECUTION_FAILED";
    const message = err.message || "Gagal mengeksekusi perintah.";
    return errorResponse(res, message, code, status);
  }
});

/**
 * 5. GET /api/commands
 * Katalog lengkap 39 perintah sender & combo
 */
app.get("/api/commands", (req, res) => {
  return successResponse(res, "Daftar fungsi sender berhasil diperoleh.", {
    total: senderEngine.COMMAND_CATALOG.length,
    commands: senderEngine.getAllCommandsMetadata()
  });
});

/**
 * Health Check Endpoint
 */
app.get("/health", (req, res) => {
  return successResponse(res, "API Bridge is running healthy.", {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    totalCommandsSupported: senderEngine.COMMAND_CATALOG.length
  });
});

// ============================================================================
// CENTRALIZED ERROR HANDLING & 404
// ============================================================================
app.use((req, res) => {
  return errorResponse(res, `Endpoint '${req.method} ${req.originalUrl}' tidak ditemukan.`, "NOT_FOUND", 404);
});

app.use((err, req, res, next) => {
  logger.error(`Internal Express Error: ${err.message || err}`);
  return errorResponse(res, "Terjadi kesalahan internal server.", "INTERNAL_SERVER_ERROR", 500, {
    error: err.message
  });
});

// ============================================================================
// WEBSOCKET SERVER IMPLEMENTATION
// ============================================================================
function setupWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  logger.setWsServer(wss);

  wss.on("connection", (ws, req) => {
    // Autentikasi WebSocket melalui query parameter (?key= atau ?token=) atau Sec-WebSocket-Protocol
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const token =
      url.searchParams.get("key") ||
      url.searchParams.get("token") ||
      req.headers["sec-websocket-protocol"];

    if (token !== CONFIG.API_KEY) {
      logger.warn(`Koneksi WebSocket ditolak: token autentikasi tidak valid dari ${req.socket.remoteAddress}`);
      ws.send(JSON.stringify({
        type: "error",
        timestamp: new Date().toISOString(),
        message: "Autentikasi WebSocket gagal: token tidak valid."
      }));
      ws.close(1008, "Authentication failed");
      return;
    }

    ws.isAuthenticated = true;
    ws.isAlive = true;

    // Catat log sukses
    logger.info(`Klien WebSocket terhubung dari ${req.socket.remoteAddress}`);

    // Tanggapi pong
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Tangani pesan masuk dari klien jika ada
    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: new Date().toISOString() }));
        } else if (parsed.type === "get_status") {
          ws.send(JSON.stringify({
            type: "connection_status",
            timestamp: new Date().toISOString(),
            data: lifecycleManager.getStatusInfo()
          }));
        }
      } catch (e) {
        // Abaikan format pesan invalid
      }
    });

    ws.on("close", (code, reason) => {
      logger.info(`Klien WebSocket terputus [Code: ${code}]`);
    });

    ws.on("error", (err) => {
      logger.error(`WebSocket error: ${err.message || err}`);
    });

    // Kirim status awal saat baru terhubung
    ws.send(JSON.stringify({
      type: "connection_status",
      timestamp: new Date().toISOString(),
      data: lifecycleManager.getStatusInfo()
    }));

    // Kirim pesan selamat datang
    ws.send(JSON.stringify({
      type: "log",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Terhubung ke Live Terminal Console Ndika Bot."
    }));
  });

  // Heartbeat Ping/Pong setiap 20 detik (CONFIG.PING_INTERVAL_MS)
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        logger.info("Menutup koneksi WebSocket yang tidak responsif (heartbeat timeout).");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
      // Kirim juga event heartbeat JSON untuk klien aplikasi
      if (ws.readyState === WebSocket.OPEN && ws.isAuthenticated) {
        ws.send(JSON.stringify({
          type: "heartbeat",
          timestamp: new Date().toISOString()
        }));
      }
    });
  }, CONFIG.PING_INTERVAL_MS);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  return wss;
}

// ============================================================================
// SERVER INITIALIZER & EXPORTS
// ============================================================================
let httpServerInstance = null;

function startApiBridge() {
  if (httpServerInstance) {
    return httpServerInstance;
  }

  httpServerInstance = http.createServer(app);
  setupWebSocketServer(httpServerInstance);

  httpServerInstance.listen(CONFIG.PORT, () => {
    console.log(chalk.magenta([
      "╔════════════════════════════════════════════════════════════════╗",
      `║   ⚡ NDIKA BOT MANAGEMENT API & WEBSOCKET SERVER ACTIVE ⚡    ║`,
      "╠════════════════════════════════════════════════════════════════╣",
      `║ • REST API Port    : ${CONFIG.PORT}`.padEnd(65) + "║",
      `║ • WebSocket Path   : ws://localhost:${CONFIG.PORT}/ws`.padEnd(65) + "║",
      `║ • Auth Protected   : ${CONFIG.API_KEY ? "ENABLED (API_KEY)" : "DISABLED"}`.padEnd(65) + "║",
      "╚════════════════════════════════════════════════════════════════╝"
    ].join("\n")));
    logger.info(`REST API & WebSocket server berjalan di port ${CONFIG.PORT}`);
  });

  return httpServerInstance;
}

module.exports = {
  startApiBridge,
  lifecycleManager,
  logger,
  CONFIG,
  setSocket: (sock, reconnectCallback) => lifecycleManager.setSocket(sock, reconnectCallback),
  handleConnectionUpdate: (update) => lifecycleManager.handleConnectionUpdate(update)
};
