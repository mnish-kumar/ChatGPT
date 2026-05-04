const express = require("express");
const router = express.Router();
const resumeController = require("../controller/resumeAnalyzer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post(
  "/analysis",
  authMiddleware.createAuthMiddleware(),
  upload.single("resume"),
  resumeController.analyzeResume,
);

module.exports = router;
