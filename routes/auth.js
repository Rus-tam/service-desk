const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/authorization-request", authController.getAuthorizationRequest);

router.post("/logout", auth, authController.postLogout);

module.exports = router;
