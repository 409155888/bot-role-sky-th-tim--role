require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField
} = require("discord.js");

const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
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
  if (user.bot) return;

  if (reaction.partial) {
    await reaction.fetch();
  }

if(reaction.message.channel.parentId !== process.env.CHANNEL_ID) return;
  if (reaction.emoji.name !== "❤️") return;

  const guild = reaction.message.guild;

  const target = await guild.members.fetch(reaction.message.author.id);

  if (target.user.bot) return;
  if (target.roles.cache.has(process.env.ROLE_ID)) return;

await target.roles.add(process.env.ROLE_ID);
  console.log(`${target.user.tag} received role`);
});

const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
console.log("TOKEN:", process.env.TOKEN ? "Có token" : "Không có token");
client.login(process.env.TOKEN);;
