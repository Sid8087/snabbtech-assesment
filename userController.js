const userModdel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const SECURE_KEY = "password";
const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "",
//     pass: "",
//   },
// });

const signup = async (req, res) => {
  //existing user check
  //hashed password
  //user creation
  //Token generate

  const { username, email, password } = req.body;
  try {
    const existingUser = await userModdel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModdel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECURE_KEY);

    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong..." });
  }
};
//signin
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModdel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found....." });
    }

    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!matchedPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECURE_KEY
    );
    return { message: "Signin successful", token: token };
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error...." });
  }
};
//fotgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModdel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User Not found....." });
    }

    // Generated a reset token using jwt
    const resetToken = jwt.sign({ email: user.email }, SECURE_KEY, {
      expiresIn: "1h", // Set expiration time for the token
    });

    user.resetPasswordToken = resetToken;
    user.expireToken = Date.now() + 36000000;
    console.log(resetToken);
    await user.save();
    res.status(200).json({ resetToken: resetToken });

    // sending email with reset link

    // const resetLink = `http://sth-url/resetpassword?token=${resetToken}`;

    // const mailOptions = {
    //   from: "demosample66@gmail.com",
    //   to: user.email,
    //   subject: "password reset",
    //   text: `Click on the following link to reset your password: ${resetLink}`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error(error);
    //     return res.status(500).json({ message: "Error sending reset email" });
    //   }
    //   console.log("Email sent: " + info.response);
    //   res
    //     .status(200)
    //     .json({ message: "Password reset link sent to your email" });
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await userModdel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update the user's password and clear the reset token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//reset password
module.exports = { signin, signup, forgotPassword, resetPassword };
