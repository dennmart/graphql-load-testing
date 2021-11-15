module.exports = {
  selectRandomUserId: selectRandomUserId
};

function selectRandomUserId(requestParams, context, ee, next) {
  // Select a random user from the `users` variable set in a prior request.
  const users = context.vars["users"];
  context.vars["selectedUser"] = users[Math.floor(Math.random() * users.length)];

  return next();
};
