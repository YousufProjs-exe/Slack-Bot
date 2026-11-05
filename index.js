/*
  help 
  password 
  ping 
  time - whatsup
  date - whatsup 
  whatsup 
  hello 
  neofetch 
  fastfetch 
  coinflip 
  dice 
  whoami 
  remind 
  quote
  calculator 
  better pool 
  my personal messaging bot
  DM reminders 
*/

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/ysh-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text:
      "*YSH — Yousuf Shell*\n\n" +
      "`/ysh-help` - Show commands\n" +
      "`/ysh-coinflip` - File a Coin to decide !\n" +
      "`/ysh-password` - generate a password\n" +
      "`/ysh-ping` - ping the bot"
  });
});

app.command("/ysh-password", async ({ ack, respond }) => {
  await ack();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789!@#$^%&*";
  const bytes = require("crypto").randomBytes(16);
  const password = Array.from(bytes, b => chars[b % chars.length]).join("");
  await respond({
    response_type: "ephemeral",
    text: `Generated password: \`${password}\``,
  });
});

app.command("/ysh-ping", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "ephemeral",
    text: "Pong!",
  });
});

app.command("/ysh-coinflip", async ({ ack, respond }) => {
  await ack();
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  await respond({
    response_type: "ephemeral",
    text: `Coin flip result: ${result}`,
  });
});

(async () => {
  await app.start();
  console.log("yah bro im running");
  // Terminaloic Hope ! 
})();
