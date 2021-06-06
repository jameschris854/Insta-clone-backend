const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require('util');

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;
  res.set('Authorization', `Bearer ${token}`);
  res.status(statusCode).json({
    status: "success",
    token,
    user
  });
};

exports.signup = async (req, res, next) => {
  console.log('signup');
  console.log(req.body);
  if (!req.body.userName) return console.log("no body");
  const { fullName, userName, email, password,photo} = req.body;

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

  console.log('loging');

  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) doc = "no email or password";

  const user = await User.findOne({ email }).select("+password").populate("posts",'id postImage postCaption createdAt');

  
  
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    doc = "incorrect password";
    
    if (!user) doc = "no user";

    res.status(400).json({
      status: "failure",
        error:doc
    });
  }else{
    createSendToken(user, 200, res);
  }
};

exports.logout = async (req, res, next) => {
  res.status(200).json({ status: "success" });
};


exports.protect = async (req,res,next) => {
  console.log(req.headers);
  try{

    console.log('validating request');
      let token
      let decoded
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
      }
      if (!token) {
        res.status(401).json({
          error:'User not logged in'
        })
      }
      try {
         decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      } catch (error) {
          res.status(401).json({
            error:error.message
          })
      }
      const freshUser = await User.findById(decoded.id).select('+password')
      if (!freshUser) {
        res.status(401).json({
          error:'no user belong to this token'
        })
      }
      req.user = freshUser
  }catch(err){
    res.status(401).json({
      error:err.message
    })
  }
    next()
}

