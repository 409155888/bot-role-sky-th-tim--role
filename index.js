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
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} Online!`);
});


client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (user.bot) return;

    if (reaction.partial) {
      await reaction.fetch();
    }

    // Dùng cho Forum Channel
    if (
      reaction.message.channel.parentId !== process.env.CHANNEL_ID &&
      reaction.message.channel.id !== process.env.CHANNEL_ID
    ) return;

    // Emoji nhận role
    if (reaction.emoji.name !== "❤️") return;

    const member = await reaction.message.guild.members.fetch(user.id);

    if (member.roles.cache.has(process.env.ROLE_ID)) return;

    await member.roles.add(process.env.ROLE_ID);

    console.log(`✅ ${member.user.tag} received role`);

  } catch (error) {
    console.log("REACTION ERROR:", error);
  }
});


// Web cho Render
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ Server is running");
});


// Login Discord
console.log(
  "TOKEN:",
  process.env.TOKEN ? "Có token" : "Không có token"
);

client.login(process.env.TOKEN)
  .catch(error => {
    console.log("❌ LOGIN ERROR:", error);
  });

