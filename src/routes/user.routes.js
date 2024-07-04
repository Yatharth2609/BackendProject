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

router.route("/login").post(controller.loginUser);

router.route("/logout").post(verifyJWT, controller.logoutUser);
router.route("/refresh-token").post(controller.refreshAccessToken);
router
  .route("/change-password")
  .post(verifyJWT, controller.changeCurrentPassword);
router.route("/current-user").get(verifyJWT, controller.getCurrentUser);
router
  .route("/update-account")
  .patch(verifyJWT, controller.updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), controller.updateUserAvatar);
router
  .route("/cover-image")
  .patch(
    verifyJWT,
    upload.single("/coverImage"),
    controller.updateUserCoverImage
  );
router.route("/c/:username").get(verifyJWT, controller.getUserChannelProfile);
router.route("/history").get(verifyJWT, controller.getWatchHistory);

module.exports = router;
