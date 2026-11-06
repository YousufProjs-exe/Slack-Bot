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
  quote 
  whoami 
  calculator 
  remind 
  better pool 
  my personal messaging bot 
  DM reminders personal - ephemeral and bot dm 
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
      "`/ysh-whatsup` - get the current date and time\n" +
      "`/ysh-password` - generate a password\n" +
      "`/ysh-ping` - ping the bot\n" +
      "`/ysh-hello` - say hello to the bot\n" +
      "`/ysh-time` - get the current time\n" + 
      "`/ysh-date` - get the current date\n" + 
      "`/ysh-neofetch` - Linux huh?\n" + 
      "`/ysh-fastfetch` - another Linux huh?\n" + 
      "`/ysh-quote` - get a random quote\n" + 
      "`/ysh-whoami` - know who you are on Slack as\n" 
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
})

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

app.command("/ysh-dice", async ({ ack, respond, command }) => {
  await ack();
  const result = Math.floor(Math.random() * 6) + 1;

  await respond({
    response_type: "in_channel",
    text: `${command.user_name} rolled a ${result}!`,
  })
});

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
});

app.command("/ysh-date", async ({ ack, respond }) => {
  await ack()
  const now = new Date()
  await respond({
    response_type: "ephemeral",
    text: `The current date is: ${now.toLocaleDateString()}`
  })
})

app.command("/ysh-whatsup", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "ephemeral",
    text: `The date is: ${new Date().toLocaleDateString()} and the time is: ${new Date().toLocaleTimeString()}`
  })
});

// cool touch ! 
app.command("/ysh-neofetch", async ({ ack, respond }) => {
  await ack()

  await respond({
    response_type: "ephemeral",
    text:
  "```\n" +
  " __   __  _____  _   _ \n" +    // this may seems to be AI generated
  " \\ \\ / / / ____|| | | |\n" +  //  but only i now how irrittating it was 
  "  \\ V / | (___  | |_| |\n" +   // to make this masterpiece.
  "   | |   \\___ \\ |  _  |\n" +
  "   | |   ____) || | | |\n" +
  "   |_|  |_____/ |_| |_|\n\n" +
  " YSH - Yousuf Shell\n" +
  " Slack Edition\n" +
  " Runtime: Node.js\n" +
  " Framework: Slack Bolt\n" +
  " Mode: Socket Mode\n" +
  "```",
  })
})

// another cool touch 
app.command("/ysh-neofetch", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text:
  "```\n" +
  " __   __  _____  _   _ \n" +    // this may seems to be AI generated
  " \\ \\ / / / ____|| | | |\n" +  //  but only i now how irrittating it was 
  "  \\ V / | (___  | |_| |\n" +   // to make this masterpiece.
  "   | |   \\___ \\ |  _  |\n" +
  "   | |   ____) || | | |\n" +
  "   |_|  |_____/ |_| |_|\n\n" +
  " YSH - Yousuf Shell\n" +
  " Slack Edition\n" +
  " Runtime: Node.js\n" +
  " Framework: Slack Bolt\n" +
  " Mode: Socket Mode\n" +
  "```",
  });
})

// Quotes ! now my my philosophy works 
app.command("/ysh-quote", async ({ ack, respond }) => {
  await ack();

  // got some of this from Google  
  const quotes = [
    "Make it work, make it right, make it fast. - Kent Beck",
    "Great things are done by a series of small things brought together. - Vincent van Gogh",
    "First, solve the problem. Then, write the code. - John Johnson",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Simplicity is the soul of efficiency. - Austin Freeman",
    "Stay hungry, stay foolish. - Steve Jobs",
    "The secret of getting ahead is getting started. - Mark Twain",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "Only Limit is your Imagination. - Steve ig",
    "Theres no pleasure when you are makin a dream come true. - Neymar Jr"
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  await respond({
    response_type: "in_channel",
    text: `*Quote of the moment*\n>${quote}`,
  });
})

app.command("/ysh-whoami", async ({ ack, respond }) => {
  await ack()
  await respond({
    response_type: "ephemeral",
    text: `Youre Slack Name <@${command.user_name}> & \nYour Slack ID: ${command.user_id}`
  })
})

app.command("/ysh-calculator", async ({ ack, respond, command }) => {
  await ack();
  const expression = command.text;
  try {
    const result = eval(expression);
    await respond({
      response_type: "ephemeral",
      text: `Result: ${result}`,
    });
  } catch (error) {
    await respond({
      response_type: "ephemeral",
      text: `Error: Invalid expression`,
    });
  }
});

(async () => {
  await app.start();
  console.log("yah bro im running");
  // Terminaloic Hope ! 
})()
