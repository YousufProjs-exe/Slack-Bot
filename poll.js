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

module.exports = {
  polls,
  createPoll,
  createPollBlocks,
};
