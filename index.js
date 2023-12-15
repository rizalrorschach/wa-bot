const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  if ((message.type === "image", "video", "gif" && message.body === ".sticker")) {
    const media = await message.downloadMedia();

    client.sendMessage(message.from, media, {
      sendMediaAsSticker: true,
      stickerName: "Rorschach",
      stickerAuthor: "Rorschach BOT",
    });
  }
});

// Mention everyone
client.on("message", async (msg) => {
  if (msg.body === "!everyone") {
    const chat = await msg.getChat();

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }
});

client.initialize();
