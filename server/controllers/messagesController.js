const { getAllMessages, createMessage } = require("../services/messageService");

const getMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Unable to fetch messages" });
  }
};

const postMessage = async (req, res) => {
  const { dancerName, name, content } = req.body;

  try {
    const newMessage = await createMessage(dancerName, name, content);
    res.status(201).json({ message: newMessage });
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: "Unable to save message" });
  }
};

module.exports = { getMessages, postMessage };
