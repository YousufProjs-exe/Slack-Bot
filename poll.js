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

module.exports = {
  polls,
  createPoll,
};