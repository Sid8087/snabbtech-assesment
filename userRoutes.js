const express = require("express");
const userRouter = express.Router();
const {
  signin,
  signup,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

userRouter.post("/signup", async (req, res) => {
  try {
    // Call the signup function and send the result
    const result = await signup(req, res);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const result = await signin(req, res);
    if (result.token) {
      res
        .status(200)
        .json({ message: "Signin successful", token: result.token });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invalid Credentials" });
  }
});

userRouter.post("/forgotpassword", async (req, res) => {
  try {
    await forgotPassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.post("/resetpassword", async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
