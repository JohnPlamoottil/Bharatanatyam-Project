const { Router } = require("express");
const {
  getMessages,
  postMessage,
} = require("../controllers/messagesController");
const { validate } = require("../middleware/validate");
const { createMessageSchema } = require("../validators/schemas");

const router = Router();

router.get("/", getMessages);
router.post("/", validate(createMessageSchema), postMessage);

module.exports = router;
