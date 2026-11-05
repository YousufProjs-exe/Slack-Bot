/*
  help 
  password 
  ping 
  coinflip 
  dice 
  hello 
  time - whatsup
  date - whatsup 
  whatsup 
  neofetch 
  fastfetch 
  whoami 
  remind 
  quote
  calculator 
  better pool 
  my personal messaging bot
  DM reminders 
*/

require("dotenv").config();
const { App } = require("@slack/bolt")

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
      "*YSH Slack Bot*\n\n" +
      "`/ysh-help` - Show commands\n" +
      "`/ysh-coinflip` - File a Coin to decide !\n" +
      "`/ysh-dice` - Rolllly rolllyyy dice ! \n" +
      "`/ysh-password` - generate a password\n" +
      "`/ysh-ping` - ping the bot\n" +
      "`/ysh-hello` - say hello to the bot\n" +
      "`/ysh-time` - get the current time\n" + 
      "`/ysh-date` - get the current date\n"
  })
})

app.command("/ysh-password", async ({ ack, respond }) => {
  await ack();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789!@#$^%&*";
  const bytes = require("crypto").randomBytes(16);
  const password = Array.from(bytes, b => chars[b % chars.length]).join("");
  await respond({
    response_type: "ephemeral",
    text: `Generated password: \`${password}\``,
  })
});

app.command("/ysh-ping", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "ephemeral",
    text: "if you can see this, means the bot is working!",
  })
})

app.command("/ysh-coinflip", async ({ ack, respond }) => {
  await ack();
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  await respond({
    response_type: "in_channel",
    text: `Coin flip result: ${result}`,
  })
})

app.command("/ysh-dice", async ({ ack, respond }) => {
  await ack();
  const result = Math.floor(Math.random() * 6) + 1;
  await respond({
    response_type: "in_channel",
    text: `${command.user_name} rolled a ${result}!`,
  })
})

app.command("/ysh-hello", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "ephemeral",
    text: `Yo! ${command.user_name}, welcome!`
  })
})

app.command("/ysh-time", async ({ ack, respond }) => {
  await ack();
  const now = new Date();
  await respond({
    response_type: "ephemeral",
    text: `The current time is: ${now.toLocaleTimeString()}`
  })
})

app.command("/ysh-date", async ({ ack, respond }) => {
  await ack()
  const now = new Date()
  await respond({
    response_type: "ephemeral",
    text: `The current date is: ${now.toLocaleDateString()}`
  })
})

(async () => {
  await app.start();
  console.log("yah bro im running");
  // Terminaloic Hope ! 
})()
