const express = require("express");
const controller = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  controller.registerUser
);

router.route("/login").post(controller.loginUser)

router.route("/logout").post(verifyJWT, controller.logoutUser)
router.route("/refresh-token").post(controller.refreshAccessToken)


module.exports = router;
