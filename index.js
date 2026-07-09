require("dotenv").config();
const {Client,GatewayIntentBits,Partials,PermissionsBitField}=require("discord.js");
const client=new Client({
 intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions],
 partials:[Partials.Message,Partials.Channel,Partials.Reaction]
});
client.once("ready",()=>console.log(`${client.user.tag} Online!`));
client.on("messageReactionAdd",async(reaction,user)=>{
 if(user.bot)return;
 if(reaction.partial) await reaction.fetch();
 if(reaction.message.channel.id!==process.env.CHANNEL_ID)return;
 if(reaction.emoji.name!=="❤️")return;
 const guild=reaction.message.guild;
 const mod=await guild.members.fetch(user.id);
 if(!mod.permissions.has(PermissionsBitField.Flags.ManageMessages))return;
 const target=await guild.members.fetch(reaction.message.author.id);
 if(target.user.bot)return;
 if(target.roles.cache.has(process.env.ROLE_ID))return;
 await target.roles.add(process.env.ROLE_ID);
 console.log(`${target.user.tag} received role`);
});
client.login(process.env.TOKEN);
onst express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
client.login("TOKEN");
