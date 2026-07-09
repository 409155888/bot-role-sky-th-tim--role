require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials
} = require("discord.js");

const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// ===================== Discord =====================

client.once("clientReady", () => {
  console.log(`✅ ${client.user.tag} Online!`);
});

client.on("error", console.error);
client.on("warn", console.warn);

client.on("shardDisconnect", (event) => {
  console.log("❌ Bot bị mất kết nối. Code:", event.code);
});

client.on("shardReconnecting", () => {
  console.log("🔄 Đang kết nối lại...");
});

client.on("shardResume", () => {
  console.log("✅ Đã kết nối lại.");
});

client.on("shardError", (error) => {
  console.log("❌ Shard Error:", error);
});

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    // Forum Channel
    if (
      reaction.message.channel.parentId !== process.env.CHANNEL_ID &&
      reaction.message.channel.id !== process.env.CHANNEL_ID
    ) return;

    // Emoji
    if (reaction.emoji.name !== "❤️") return;

    const member = await reaction.message.guild.members.fetch(user.id);

    if (member.roles.cache.has(process.env.ROLE_ID)) return;

    await member.roles.add(process.env.ROLE_ID);

    console.log(`✅ Đã cấp role cho ${member.user.tag}`);
  } catch (err) {
    console.log("❌ REACTION ERROR:", err);
  }
});

// ===================== Express =====================

const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// ===================== Login =====================

console.log("TOKEN:", process.env.TOKEN ? "Có token" : "Không có token");

client.login(process.env.TOKEN).catch((err) => {
  console.log("❌ LOGIN ERROR:", err);
});

