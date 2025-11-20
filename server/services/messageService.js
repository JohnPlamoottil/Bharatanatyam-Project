const { Message } = require("../messages");

async function getAllMessages() {
  const messages = await Message.find({}).sort({ createdAt: "desc" });
  return messages;
}

async function createMessage(dancerName, name, content) {
  const newMessage = new Message({ dancerName, name, content });
  await newMessage.save();
  return newMessage;
}

module.exports = { getAllMessages, createMessage };
