/**
 * Waits for a single message from the person talking to the bot.
 * @param {Message} message Represents a message sent by a user.
 * @return {string} The plain text entered by the user.
 */
const getUserInput = async (message) => {
  const filter = m => m.author.id === message.author.id;
  let response;
  await message.channel.awaitMessages(filter, { max: 1 })
    .then(collected => response = collected.first().content);
  return response;
};

/**
 * Ask question > wait for answer > update variables > return
 * @param {Message} message Represents a message sent by a user.
 * @param {string} question The question being asked.
 * @param {Array<string>} userResponses An array of all the values currently gathered from the user.
 */
const getSingleInput = async (message, question) => {
  message.channel.send(question);
  return await getUserInput(message);
};

module.exports = {
  getUserInput: getUserInput,
  getSingleInput: getSingleInput
};