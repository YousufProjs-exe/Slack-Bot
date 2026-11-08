const polls = new Map();

function createPoll(userId, question, options) {
  const pollId = Date.now().toString();

  const poll = {
    id: pollId,
    creator: userId,
    question,
    options: options.map((name, index) => ({
      id: index.toString(),
      name,
      votes: [],
    })),
    closed: false,
  };

  polls.set(pollId, poll);

  return poll;
}

function createPollBlocks(poll) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${poll.question}*\n_Vote for one option:_`,
      },
    },
    {
      type: "actions",
      elements: poll.options.map(option => ({
        type: "button",
        text: {
          type: "plain_text",
          text: `${option.name} (${option.votes.length})`,
        },
        action_id: `ysh_poll_vote_${option.id}`,
        value: `${poll.id}:${option.id}`,
      })),
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Total votes: ${poll.options.reduce((total, option) => total + option.votes.length, 0)}`,
        },
      ],
    },
  ];
}

function castVote(pollId, optionId, userId) {
  const poll = polls.get(pollId);

  if (!poll || poll.closed) {
    return { success: false, message: "This poll is unavailable or closed." };
  }

  const option = poll.options.find(option => option.id === optionId);

  if (!option) {
    return { success: false, message: "Invalid poll option." };
  }

  const alreadyVoted = poll.options.some(option =>
    option.votes.includes(userId)
  );

  if (alreadyVoted) {
    return { success: false, message: "You've already voted!" };
  }

  option.votes.push(userId);
  return { success: true, poll };
}

function setPollMessage(pollId, channelId, messageTs) {
  const poll = polls.get(pollId);

  if (!poll) return;

  poll.channelId = channelId;
  poll.messageTs = messageTs;
}

module.exports = {
  polls,
  createPoll,
  createPollBlocks,
  castVote,
  setPollMessage,
};
