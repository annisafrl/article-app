const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const router = express.Router();
const authRoutes = require("./auth");
const topicRoutes = require("./topic");

router.use("/auth", authRoutes)
router.use("/topic", verifyToken, topicRoutes)

module.exports = router