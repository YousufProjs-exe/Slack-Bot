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
  reminders 
  better pool 
  my personal messaging bot 
  DM reminders personal - ephemeral and bot dm [ used AI to actually debug the not working but error free code ]
*/

require("dotenv").config();
const { App } = require("@slack/bolt")
const { Parser } = require("expr-eval");
const { createPoll, polls, createPollBlocks, castVote, setPollMessage, closepoll } = require("./poll");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});
const fs = require("fs");
const OWNER_ID = "U0BQHKTP8F3";
const settingsFile = "./auto-reply.json";
let autoReply = fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile, "utf8")) : { enabled: true, channel: null, messageTs: null };
function saveAutoReply() {
  fs.writeFileSync(settingsFile, JSON.stringify(autoReply, null, 2));
}
function autoReplyBlocks() {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*YSH Helper — Auto-Replies*\nStatus: *${autoReply.enabled ? "ON" : "OFF"}*\n\nAutomatically respond when someone mentions you.`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          action_id: "toggle_auto_reply",
          text: {
            type: "plain_text",
            text: autoReply.enabled ? "Turn OFF" : "Turn ON",
          },
          style: autoReply.enabled ? "danger" : "primary",
          value: "toggle",
        },
      ],
    },
  ];
}
app.action("toggle_auto_reply", async ({ ack, body, client }) => {
  await ack();
  if (body.user.id !== OWNER_ID) return;
  autoReply.enabled = !autoReply.enabled;
  saveAutoReply();
  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: "YSH Helper Auto-Reply Settings",
    blocks: autoReplyBlocks(),
  });
});

async function setupAutoReplyPanel() {
  const dm = await app.client.conversations.open({
    users: OWNER_ID,
  });

  autoReply.channel = dm.channel.id;

  if (autoReply.messageTs) {
    try {
      await app.client.chat.update({
        channel: autoReply.channel,
        ts: autoReply.messageTs,
        text: "YSH Helper Auto-Reply Settings",
        blocks: autoReplyBlocks(),
      });

      saveAutoReply();
      return;
    } catch {}
  }

  const message = await app.client.chat.postMessage({
    channel: autoReply.channel,
    text: "YSH Helper Auto-Reply Settings",
    blocks: autoReplyBlocks(),
  });
  autoReply.messageTs = message.ts;
  saveAutoReply();
}

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
      "`/ysh-neofetch` - Linux huh? YSH\n" + 
      "`/ysh-fastfetch` - another Linux huh? Slack\n" + 
      "`/ysh-quote` - get a random quote\n" + 
      "`/ysh-whoami` - know who you are on Slack as\n" + 
      "`/ysh-calculator` - calculate a mathematical expression\n" +
      "`/ysh-remind` - set a reminder for yourself\n" + 
      "`/ysh-poll` - create a poll with up to 5 options\n" + 
      "`/ysh-poll-close` - close a poll and show results\n" +
      "\n*Note:* All commands are case-insensitive and NO COMMAND BLOCK them (they are slash command so type it).",
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

// ppl expect pong smtimes 
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

app.command("/ysh-hello", async ({ ack, respond, command }) => {
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

// another cool touch - source is PS with Slack CLI ! 
app.command("/ysh-fastfetch", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text:
  "```\n" +
  "  ____   _         _        ____   _  __     ____  _       ___ \n" +
  " / ___| | |       / \\      / ___| | |/ /    / ___|| |     |_ _|\n" +
  " \\___ \\ | |      / _ \\    | |     | ' /    | |    | |      | | \n" +
  "  ___) || |___  / ___ \\   | |___  | . \\    | |___ | |___   | | \n" +
  " |____/ |_____|/_/   \\_\\   \\____| |_|\\_\\    \\____||_____| |___|\n" +
  "\n" +
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

app.command("/ysh-whoami", async ({ ack, respond, command }) => {
  await ack()
  await respond({
    response_type: "ephemeral",
    text: `Youre Slack Name <@${command.user_name}> & \nYour Slack ID: ${command.user_id}`
  })
})

app.command("/ysh-calculator", async ({ ack, respond, command }) => {
  await ack();

  try {
    const parser = new Parser();
    const expression = command.text.trim();
    if (!expression) {
      return await respond({
        response_type: "ephemeral",
        text: "Usage: `/ysh-calculator 25 * (10 + 5)`",
      });
    }

    const result = parser.evaluate(expression);
    await respond({
      response_type: "ephemeral",
      text: `Result: ${result}`,
    })

  } catch (error) {
    await respond({
      response_type: "ephemeral",
      text: "Invalid expression!? ",
    });
  }
})

app.command("/ysh-remind", async ({ ack, respond, command }) => {
  await ack();
  const match = command.text.match(/^(\d+)(s|m|h)\s+(.+)$/i);
  if (!match) {
    return await respond({
      response_type: "ephemeral",
      text: "Usage: `/ysh-remind 10m Finish my assignment`",
    });
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const message = match[3]
  const multipliers = { s: 1000, m: 60000, h: 3600000};
  const delay = amount * multipliers[unit];

  if (amount <= 0 || delay > 2147483647) {
    return await respond({
      response_type: "ephemeral",
      text: "Invalid reminder duration.",
    })
  }

  await respond({
    response_type: "ephemeral",
    text: `Reminder set! I'll DM you in ${amount}${unit}.`,
  })

  setTimeout(async () => {
    try {
      const dm = await app.client.conversations.open({
        users: command.user_id,
      });

      await app.client.chat.postMessage({
        channel: dm.channel.id,
        text: `:alarm_clock: *Reminder!*\n${message}`,
      })

    } catch (error) {
      console.error("Reminder failed:", error);
    }
  }, delay);
})

app.command("/ysh-poll", async ({ ack, respond, command }) => {
  await ack();
  const parts = command.text.split("|").map(part => part.trim());
  const question = parts.shift();
  const options = parts;

  if (!question || options.length < 2 || options.length > 5) {
    return await respond({
      response_type: "ephemeral",
      text: "Usage: `/ysh-poll Question? | Option 1 | Option 2`\nProvide 2–5 options.",
    });
  }

  if (options.some(option => !option)) {
    return await respond({
      response_type: "ephemeral",
      text: "Poll options cannot be empty.",
    });
  }

  const poll = createPoll(command.user_id, question, options);
  const message = await app.client.chat.postMessage({
    channel: command.channel_id,
    text: `Poll: ${poll.question} (ID: ${poll.id})`,
    blocks: createPollBlocks(poll),
  });

  setPollMessage(poll.id, message.channel, message.ts);
});

app.action(/^ysh_poll_vote_/, async ({ ack, body }) => {
  await ack()
  const [pollId, optionId] = body.actions[0].value.split(":");
  const result = castVote(pollId, optionId, body.user.id);

  if (!result.success) {
    return await app.client.chat.postEphemeral({
      channel: body.channel.id,
      user: body.user.id,
      text: result.message,
    });
  }

  await app.client.chat.update({
    channel: result.poll.channelId,
    ts: result.poll.messageTs,
    text: `Poll: ${result.poll.question}`,
    blocks: createPollBlocks(result.poll),
  });

  await app.client.chat.postEphemeral({
    channel: body.channel.id,
    user: body.user.id,
    text: "Your vote has been recorded!",
  });
});

app.command("/ysh-poll-close", async ({ ack, respond, command }) => {
  await ack()
  const pollId = command.text.trim();

  if (!pollId) {
    return await respond({
      response_type: "ephemeral",
      text: "Usage: `/ysh-poll-close POLL_ID`",
    });
  }

  const result = closePoll(pollId, command.user_id);
  if (!result.success) {
    return await respond({
      response_type: "ephemeral",
      text: result.message,
    });
  }

  const poll = result.poll;
  const totalVotes = poll.options.reduce((total, option) => total + option.votes.length, 0);
  const highestVotes = Math.max(...poll.options.map(option => option.votes.length));
  const winners = poll.options.filter(option => option.votes.length === highestVotes);
  const winnerText = totalVotes === 0
    ? "No votes were recorded."
    : winners.length > 1
      ? `Tie: ${winners.map(option => option.name).join(", ")}`
      : `Winner: *${winners[0].name}*`;

  await app.client.chat.update({
    channel: poll.channelId,
    ts: poll.messageTs,
    text: `Closed poll: ${poll.question}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:lock: *${poll.question}*\n\n${poll.options
            .map(option => `• ${option.name}: *${option.votes.length}* votes`)
            .join("\n")}\n\n${winnerText}`,
        },
      },
    ],
  })

  await respond({
    response_type: "ephemeral",
    text: "Poll closed successfully!",
  });
});

app.event("message", async ({ event, client }) => {
  if (!autoReply.enabled) return;
  if (event.subtype || event.bot_id || !event.user) return;
  if (event.user === OWNER_ID) return;
  if (!event.text?.includes(OWNER_ID)) return;
  await client.chat.postMessage({
    channel: event.channel,
    thread_ts: event.ts,
    text: `<@${event.user}> Yousuf is busy. He may reply later.`,
  });
  const dm = await client.conversations.open({users: OWNER_ID,});
  await client.chat.postMessage({
    channel: dm.channel.id,
    text: `You were mentioned in <#${event.channel}>:\n\n${event.text}`,
  });
});

(async () => {
  await app.start();
  await setupAutoReplyPanel();
  console.log("yah bro im running");
  // Terminaloic Hope ! 
})()
