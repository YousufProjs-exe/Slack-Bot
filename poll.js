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
        text: `*${poll.question}*`,
      },
    },
    {
      type: "actions",
      elements: poll.options.map(option => ({
        type: "button",
        text: {
          type: "plain_text",
          text: option.name,
        },
        action_id: "ysh_poll_vote",
        value: `${poll.id}:${option.id}`,
      })),
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

module.exports = {
  polls,
  createPoll,
  createPollBlocks,
  castVote,
}
