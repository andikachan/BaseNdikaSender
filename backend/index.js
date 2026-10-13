// ===============================================
//       ⚡ NDIKA BOT VIP - CONNECTION CORE ⚡
//            Created by Ndika Official
// ===============================================
console.clear();
require("./config");

// Inisialisasi API Bridge & WebSocket Server
const apiBridge = require("./api_bridge");
apiBridge.startApiBridge();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestWaWebVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  jidDecode,
  proto,
  getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys");

const chalk = require("chalk");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const FileType = require("file-type");
const readline = require("readline");
const PhoneNumber = require("awesome-phonenumber");
const path = require("path");
const NodeCache = require("node-cache");

const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetchJson,
  sleep
} = require("./lib/utils.js");

const usePairingCode = global.connect;

function question(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    });
  });
}

async function connectToWhatsApp() {
  console.log(chalk.cyan([
    "────────────────────────────────────────",
    "  Ndika Assistant — Multi Device System",
    "────────────────────────────────────────",
    "• Bot     : " + (global.botname || "Ndika"),
    "• Creator : " + (global.ownername || "Ndika Official"),
    "• Mode    : " + (global.publicX ? "Public" : "Self"),
    "• Status  : Siap digunakan",
    "────────────────────────────────────────"
  ].join("\n")));

  const { version, isLatest } = await fetchLatestWaWebVersion();
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    printQRInTerminal: !usePairingCode,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch =
        !!message.buttonsMessage ||
        !!message.templateMessage ||
        !!message.listMessage;
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {}
              },
              ...message
            }
          }
        };
      }
      return message;
    },
    version: version,
    logger: pino({ level: "silent" }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino().child({ level: "silent", stream: "store" })
      )
    }
  });

  // Daftarkan sock Baileys ke API Bridge Lifecycle Manager
  apiBridge.setSocket(sock, connectToWhatsApp);

  // Pairing code registration (Mendukung CLI Terminal dan API Dashboard)
  if (usePairingCode && !sock.authState.creds.registered) {
    if (process.env.PAIRING_MODE === "api") {
      console.log(chalk.cyan("\n[API MODE] Menunggu permintaan pairing code dari Dashboard Android / POST /getPairing...\n"));
    } else {
      console.log(chalk.cyan("\nSilakan masukkan nomor telepon WhatsApp Anda (tekan Enter untuk lewati ke Dashboard):"));
      const phoneNumber = await question(
        chalk.white("Nomor WhatsApp (contoh: 628xxx): ")
      );
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
      if (cleanNumber) {
        const code = await sock.requestPairingCode(cleanNumber, "NDIKA123");
        console.log(chalk.green("\nKode Pairing: " + code + "\n"));
      } else {
        console.log(chalk.yellow("Input terminal dilewati. Buka Dashboard Android untuk meminta pairing code."));
      }
    }
  }

  const store = makeInMemoryStore({
    logger: pino({ level: "silent" }).child({ stream: "store" })
  });
  store.bind(sock.ev);

  sock.ev.on("call", async (callData) => {
    console.log(chalk.yellow("[CALL] Incoming/Outgoing call event"));
  });

  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + "@" + decode.server) ||
        jid
      );
    } else {
      return jid;
    }
  };

  sock.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      let mek = chatUpdate.messages[0];
      if (!mek || !mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") return;

      // MODE BASE SENDER WORKER:
      // Bot ini didedikasikan khusus sebagai Sender API & Management Dashboard.
      // Auto-reply dan eksekusi command chat (seperti .menu, .ping, dll.) dinonaktifkan
      // agar bot tidak pernah membalas pesan obrolan di WhatsApp secara otomatis.
      const senderJid = mek.key.participant || mek.key.remoteJid || "";
      const text = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
      if (text) {
        console.log(chalk.gray(`[INCOMING MSG] Dari ${senderJid}: "${text.slice(0, 40)}" (Dilewati - Tidak membalas)`));
      }
      return;
    } catch (err) {
      console.error(chalk.red("Error processing message upsert:"), err);
    }
  });

  sock.getFile = async (input, save) => {
    let res;
    let data = Buffer.isBuffer(input)
      ? input
      : /^data:.*?\/.*?;base64,/i.test(input)
      ? Buffer.from(input.split`,`[1], "base64")
      : /^https?:\/\//.test(input)
      ? await (res = await getBuffer(input))
      : fs.existsSync(input)
      ? fs.readFileSync(input)
      : typeof input === "string"
      ? input
      : Buffer.alloc(0);

    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin"
    };

    let filename = path.join(
      __dirname,
      "./" + new Date() * 1 + "." + type.ext
    );
    if (data && save) {
      await fs.promises.writeFile(filename, data);
    }

    return {
      res: res,
      filename: filename,
      size: await getSizeMedia(data),
      ...type,
      data: data
    };
  };

  sock.downloadMediaMessage = async (message) => {
    let msg = message.msg || message;
    let mime = msg.mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(msg, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  sock.sendText = (jid, text, quoted = "", options = {}) => {
    return sock.sendMessage(
      jid,
      {
        text: text,
        ...options
      },
      {
        quoted: quoted
      }
    );
  };

  sock.sendImageAsSticker = async (jid, pathMedia, quoted, options = {}) => {
    let buff = Buffer.isBuffer(pathMedia)
      ? pathMedia
      : /^data:.*?\/.*?;base64,/i.test(pathMedia)
      ? Buffer.from(pathMedia.split`,`[1], "base64")
      : /^https?:\/\//.test(pathMedia)
      ? await getBuffer(pathMedia)
      : fs.existsSync(pathMedia)
      ? fs.readFileSync(pathMedia)
      : Buffer.alloc(0);

    let stickerPayload = {
      sticker: buff,
      ...options
    };
    return await sock.sendMessage(jid, stickerPayload, { quoted: quoted });
  };

  sock.sendVideoAsSticker = async (jid, pathMedia, quoted, options = {}) => {
    let buff = Buffer.isBuffer(pathMedia)
      ? pathMedia
      : /^data:.*?\/.*?;base64,/i.test(pathMedia)
      ? Buffer.from(pathMedia.split`,`[1], "base64")
      : /^https?:\/\//.test(pathMedia)
      ? await getBuffer(pathMedia)
      : fs.existsSync(pathMedia)
      ? fs.readFileSync(pathMedia)
      : Buffer.alloc(0);

    let stickerPayload = {
      sticker: buff,
      ...options
    };
    return await sock.sendMessage(jid, stickerPayload, { quoted: quoted });
  };

  sock.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let msg = message.msg || message;
    let mime = msg.mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(msg, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension
      ? filename + "." + (type ? type.ext : "bin")
      : filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  sock.sendMedia = async (
    jid,
    pathMedia,
    caption = "",
    quoted = "",
    options = {}
  ) => {
    let { mime, data } = await sock.getFile(pathMedia, true);
    let type = mime.split("/")[0];
    let messagePayload = {};

    if (type === "image") {
      messagePayload = { image: data, caption: caption, ...options };
    } else if (type === "video") {
      messagePayload = { video: data, caption: caption, ...options };
    } else if (type === "audio") {
      messagePayload = {
        audio: data,
        ptt: options.ptt || false,
        ...options
      };
    } else {
      messagePayload = {
        document: data,
        mimetype: mime,
        fileName: options.fileName || "file"
      };
    }
    await sock.sendMessage(jid, messagePayload, { quoted: quoted });
  };

  sock.sendPoll = async (jid, name, values) => {
    const pollMessage = {
      pollCreationMessage: {
        name: name,
        options: values.map((val) => ({ optionName: val })),
        selectableCount: 1
      }
    };
    await sock.sendMessage(jid, pollMessage);
  };

  sock.setStatus = async (status) => {
    await sock.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status"
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8")
        }
      ]
    });
    console.log(chalk.yellow("Status updated: " + status));
  };

  sock.public = global.publicX;

  sock.ev.on("connection.update", async (update) => {
    // Teruskan status koneksi ke API Bridge & WebSocket
    apiBridge.handleConnectionUpdate(update);

    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode !== DisconnectReason.loggedOut) {
        console.log(chalk.yellow("[RECONNECT] Menghubungkan ulang ke WhatsApp..."));
        connectToWhatsApp();
      } else {
        console.log(chalk.red("[LOGOUT] Sesi telah keluar. Hapus folder session dan pairing ulang."));
      }
    } else if (connection === "open") {
      console.log(chalk.green("[INFO] Bot " + (global.botname || "Ndika") + " berhasil terhubung ke WhatsApp."));
    }
  });

  sock.ev.on("error", (err) => {
    console.error(chalk.red("Error: "), err.message || err);
  });

  sock.ev.on("creds.update", saveCreds);
}

// Start connection
connectToWhatsApp();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.green(`${__filename} updated!`));
  delete require.cache[file];
  require(file);
});