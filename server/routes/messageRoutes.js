const { Router } = require("express");
const {
  getMessages,
  postMessage,
} = require("../controllers/messagesController");

const router = Router();

router.get("/", getMessages);
router.post("/", postMessage);

module.exports = router;
