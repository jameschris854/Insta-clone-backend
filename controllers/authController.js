const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;
  res.set("Authorization", `Bearer ${token}`);
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.signup = async (req, res, next) => {
  console.log("signup");
  console.log(req.body);
  if (!req.body.userName) return(next(new AppError('data not sufficient',404)))

  const { fullName, userName, email, password, photo } = req.body;

  const doc = await User.create({
    userName,
    email,
    password,
    fullName,
    photo,
  });
  createSendToken(doc, 200, res);
};

exports.login = async (req, res, next) => {
  console.log("loging");

  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) doc = "no email or password";

  const user = await User.findOne({ email })
    .select("+password")
    .populate("posts", "id postImage postCaption createdAt");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return(next(new AppError('incorrect password',404)))

    if (!user) doc = "no user";
  } else {
    createSendToken(user, 200, res);
  }
};

exports.logout = async (req, res, next) => {
  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    console.log("validating request");
    let token;
    let decoded;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return(next(new AppError('no auth token',404)))
    }
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      return(next(new AppError(error.message,404)))
    }
    const freshUser = await User.findById(decoded.id).select("+password");
    if (!freshUser) {
      return(next(new AppError('no user found',404)))
    }
    req.user = freshUser;
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
  next();
};

exports.forgotPassword = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = resetToken;
    user.passwordResetToken = passwordResetToken;
    await sendEmail({
      email:req.body.email,
      subject: "insta-clone-Auth",
      token: passwordResetToken,
    });
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.save();
    res.status(200).json({
      status: "success",
      token: user.passwordResetToken,
      expiresIn: user.passwordResetExpires,
    });
  } catch (error) {
    return(next(new AppError(error.message?error.message:'something went wrong',404)))
  }
};

exports.resetPassword = async (req, res, next) => {
  console.log(req.body);

  const user = await User.findOne({
    passwordResetToken: req.body.passwordResetToken,
  }).select("+password");

  if (user.passwordResetExpires > Date.now()) {
    hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
    console.log(req.body.newPassword, hashedPassword);
    user.password = req.body.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordModified = Date.now();
    await user.save();

    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(401).json({
      status: "fail",
      error: "reset time expired",
    });
  }
};
