require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once("ready", () => {
  console.log(`${client.user.tag} Online!`);
});

client.login(process.env.TOKEN)
  .then(() => {
    console.log("Login thành công");
  })
  .catch((err) => {
    console.log("LOGIN ERROR:", err);
  });

const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});

