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
  console.log(`${client.user.tag} Online!`);
});

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (user.bot) return;

    if (reaction.partial) {
      await reaction.fetch();
    }

    // Dùng cho Forum Channel
    if (reaction.message.channel.parentId !== process.env.CHANNEL_ID) return;

    if (reaction.emoji.name !== "❤️") return;

    const member = await reaction.message.guild.members.fetch(user.id);

    await member.roles.add(process.env.ROLE_ID);

    console.log(`${member.user.tag} received role`);

  } catch (err) {
    console.log("REACTION ERROR:", err);
  }
});

const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});

console.log("TOKEN:", process.env.TOKEN ? "Có token" : "Không có token");

client.login(process.env.TOKEN)
  .catch(err => {
    console.log("LOGIN ERROR:", err);
  });
