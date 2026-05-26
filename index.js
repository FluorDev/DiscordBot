const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const PREMIUM_ROLE = "Premium";
const ADMIN_CHANNEL_ID = "1508848391478841395";
const CHAT_CHANNEL_ID = "1508132773938856079";

const FREE_SCRIPT = "https://your-free-script.com";
const PREMIUM_SCRIPT = "https://your-premium-script.com";
const GET_KEY_LINK = "https://your-key-link.com";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands = [

  new SlashCommandBuilder()
    .setName("getscript")
    .setDescription("Get free script"),

  new SlashCommandBuilder()
    .setName("getscriptpremium")
    .setDescription("Get premium script"),

  new SlashCommandBuilder()
    .setName("getkey")
    .setDescription("Get key link"),

  new SlashCommandBuilder()
    .setName("redeem")
    .setDescription("Redeem premium")

].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {

    await rest.put(
      Routes.applicationGuildCommands(
        1508457570451460190,
        1507406973266690169
      ),
      { body: commands }
    );

    console.log("Slash commands loaded!");

  } catch(err) {
    console.log(err);
  }
})();

client.once("ready", () => {

  console.log(`${client.user.tag} online!`);

  // Notify mỗi 5 phút
  setInterval(async () => {

    const channel =
      client.channels.cache.get(CHAT_CHANNEL_ID);

    if(channel) {

      channel.send({
        content:
`# 🔥 Mizu Hub Premium
**💎 Use /getscriptpremium
🔑 Use /getkey**`
      });

    }

  }, 300000);

});

client.on("interactionCreate", async interaction => {

  if(!interaction.isChatInputCommand()) return;

  // GETSCRIPT
  if(interaction.commandName === "getscript") {

    return interaction.reply({
      content:
`📜 Free Script:
${FREE_SCRIPT}`,
      ephemeral: true
    });

  }

  // GETSCRIPT PREMIUM
  if(interaction.commandName === "getscriptpremium") {

    const role =
      interaction.member.roles.cache.find(
        r => r.name === PREMIUM_ROLE
      );

    if(!role) {

      return interaction.reply({
        content:
"❌ Warning: You do not have a role.",
        ephemeral: true
      });

    }

    return interaction.reply({
      content:
`💎 Premium Script:
${PREMIUM_SCRIPT}`,
      ephemeral: true
    });

  }

  // GETKEY
  if(interaction.commandName === "getkey") {

    return interaction.reply({
      content:
`🔑 Get Key:
${GET_KEY_LINK}`,
      ephemeral: true
    });

  }

  // REDEEM
  if(interaction.commandName === "redeem") {

    const adminChannel =
      client.channels.cache.get(
        ADMIN_CHANNEL_ID
      );

    const embed = new EmbedBuilder()
      .setTitle("📥 REDEEM REQUEST")
      .setColor("Yellow")
      .addFields(
        {
          name: "👤 User",
          value: `${interaction.user.tag}`
        },
        {
          name: "🆔 User ID",
          value: `${interaction.user.id}`
        },
        {
          name: "💎 Key Type",
          value: "Premium"
        },
        {
          name: "📌 Status",
          value: "🟡 Pending"
        },
        {
          name: "⏰ Time",
          value:
`<t:${Math.floor(Date.now()/1000)}:F>`
        }
      );

    if(adminChannel) {
      adminChannel.send({
        embeds: [embed]
      });
    }

    return interaction.reply({
      content:
"✅ currently being checked",
      ephemeral: true
    });

  }

});

client.login(TOKEN);
