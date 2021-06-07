const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword",authController.forgotPassword)
router.patch('/updatePassword',authController.protect,userController.updatePassword)
router.patch('/resetPassword',authController.resetPassword)

router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser)
  .patch(authController.protect,userController.updateUser)
  .delete(authController.protect,userController.deleteMe)
  
router.use(authController.protect);
router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
