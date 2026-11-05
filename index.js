/*
  existing bot + 
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
      "`/ysh-password` - generate a password\n" 
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
