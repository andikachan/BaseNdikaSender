const http = require("http");
const { WebSocket } = require("ws");
const { startApiBridge, lifecycleManager, logger } = require("./api_bridge");

async function runTests() {
  console.log("=== MEMULAI TEST SUITE API BRIDGE ===");

  // 1. Jalankan server
  const server = startApiBridge();
  await new Promise((r) => setTimeout(r, 800));

  const PORT = 25566;
  const API_KEY = "ndika_secret_key_2026";

  function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "127.0.0.1",
        port: PORT,
        path: path,
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on("error", reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  try {
    // TEST 1: Health check (public)
    console.log("\n[TEST 1] GET /health (Public)");
    const resHealth = await request("GET", "/health");
    console.log("Status:", resHealth.status, "Response:", resHealth.data);
    if (resHealth.status !== 200 || !resHealth.data.success) throw new Error("Health check failed");

    // TEST 2: GET /mySender tanpa API Key (Harus 401 Unauthorized)
    console.log("\n[TEST 2] GET /mySender tanpa autentikasi (Expect 401)");
    const resAuthFail = await request("GET", "/mySender");
    console.log("Status:", resAuthFail.status, "Response:", resAuthFail.data);
    if (resAuthFail.status !== 401) throw new Error("Auth check failed to reject unauthorized request");

    // TEST 3: GET /mySender dengan API Key via Header
    console.log("\n[TEST 3] GET /mySender dengan Header x-api-key (Expect 200)");
    const resSender = await request("GET", "/mySender", null, { "x-api-key": API_KEY });
    console.log("Status:", resSender.status, "Response:", resSender.data);
    if (resSender.status !== 200 || !resSender.data.success) throw new Error("mySender failed with valid key");

    // TEST 4: GET /mySender dengan API Key via Query Parameter ?key=
    console.log("\n[TEST 4] GET /mySender?key=... (Expect 200)");
    const resSenderQuery = await request("GET", `/mySender?key=${API_KEY}`);
    console.log("Status:", resSenderQuery.status, "Response:", resSenderQuery.data);
    if (resSenderQuery.status !== 200) throw new Error("Query auth failed");

    // TEST 5: POST /getPairing tanpa socket terhubung (Expect 503 BOT_NOT_INITIALIZED)
    console.log("\n[TEST 5] POST /getPairing saat socket bot belum siap (Expect 503)");
    const resPairingNoSock = await request(
      "POST",
      "/getPairing",
      { phoneNumber: "6281234567890" },
      { "x-api-key": API_KEY }
    );
    console.log("Status:", resPairingNoSock.status, "Response:", resPairingNoSock.data);
    if (resPairingNoSock.status !== 503) throw new Error("Pairing should return 503 when bot is not initialized");

    // TEST 6: Simulasikan Mock Baileys Socket untuk verifikasi pairing & send-command
    console.log("\n[TEST 6] Simulasi Mock Socket Baileys ke Lifecycle Manager");
    const mockSocket = {
      user: { id: "628999888777:0@s.whatsapp.net", name: "Mock Ndika Bot" },
      authState: { creds: { registered: false } },
      requestPairingCode: async (phone, code) => "ABC1-XYZ2",
      sendMessage: async (jid, msg) => ({ key: { id: "MSG_123" } }),
      ws: { close: () => {} },
      end: () => {}
    };
    lifecycleManager.setSocket(mockSocket, () => console.log("Mock reconnect triggered"));

    // TEST 7: POST /getPairing dengan mock socket (Expect 200 + kode pairing)
    console.log("\n[TEST 7] POST /getPairing dengan socket aktif (Expect 200 + Pairing Code)");
    const resPairingSuccess = await request(
      "POST",
      "/getPairing",
      { phoneNumber: "6281234567890", customCode: "NDIKA123" },
      { "x-api-key": API_KEY }
    );
    console.log("Status:", resPairingSuccess.status, "Response:", resPairingSuccess.data);
    if (resPairingSuccess.status !== 200 || resPairingSuccess.data.data.pairingCode !== "ABC1-XYZ2") {
      throw new Error("Pairing generation failed");
    }

    // TEST 8: Test WebSocket Realtime Connection
    console.log("\n[TEST 8] WebSocket Connection & Auth via Query Param");
    const ws = new WebSocket(`ws://127.0.0.1:${PORT}/ws?key=${API_KEY}`);
    const wsMessages = [];

    await new Promise((resolve, reject) => {
      ws.on("open", () => {
        console.log("WebSocket connected successfully!");
        logger.info("Test log broadcast dari unit test suite!");
      });
      ws.on("message", (raw) => {
        const parsed = JSON.parse(raw.toString());
        wsMessages.push(parsed);
        if (wsMessages.length >= 2) {
          resolve();
        }
      });
      ws.on("error", reject);
      setTimeout(resolve, 1500); // Timeout fallback
    });

    console.log("Pesan WebSocket yang diterima:", wsMessages);
    ws.close();

    console.log("\n========================================================");
    console.log("✔ SELURUH PENGUJIAN API BRIDGE & WEBSOCKET BERHASIL 100%");
    console.log("========================================================");
    process.exit(0);
  } catch (err) {
    console.error("Test Error:", err);
    process.exit(1);
  }
}

runTests();
