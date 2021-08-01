const User = require("../models/userModel");
const multer = require("multer");
const AppError = require("../utils/appError");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");

exports.resizePhoto = (req, res, next) => {
  console.log(sharp.cache(false))
  if (!req.file) return next();
  console.log(req.file);
  sharp(req.file.path)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/users");
  },
  filename: function (req, file, cb) {
    cb(null, "user-" + req.user.id + Date.now() + ".jpg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image!,please upload only images.", 400), false);
  }
};

let upload = multer({ storage: storage, fileFilter: multerFilter });

exports.uploaduserPhoto = upload.single("photo");


exports.getAllUser = async (req, res, next) => {
  console.log("getting user");
  let doc = {};
  try {
    doc = await User.find();
  } catch (err) {
    return(next(new AppError(err.message,404)))
  }
  res.status(200).json({
    status: "success",
    data: {
      users: doc,
    },
  });
};

exports.createUser = async (req, res, next) => {
  console.log("creating user");
  let doc = "null";
  try {
    doc = await User.create(req.body);
  } catch (err) {
    return(next(new AppError(err.message,404)))
  }

  console.log("creating user");
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
};

exports.getUser = async (req, res, next) => {
  console.log("getting user", req.params.id);
  let doc = {};
  try {
    doc = await User.findById(req.params.id).populate("posts")
  } catch (err) {
    return(next(new AppError(err.message,404)))
  }
  res.status(200).json({
    status: "success",
    user: doc,
  });
};

exports.deleteUser = async (req, res, next) => {
  console.log("deleting...");
  let doc = {};
  try {
    doc = await User.findByIdAndDelete(req.user.id);
  } catch (err) {
    return(next(new AppError(err.message,404)))
  }
  res.status(204).json({
    status: "success",
  });
};

exports.updateUser = async (req, res, next) => {
  try {
    let cloudinaryRes = await cloudinary.uploader.upload(
      "public/img/users/" + req.body.photo,
      { public_id: `user/${req.body.photo.replace(".jpg", "")}` }
    );
    console.log(cloudinaryRes);
    req.body.photo = cloudinaryRes.url;
  } catch (e) {
    return next(new AppError(JSON.stringify(e), 404));
  }
  console.log("updating..");
  let doc = {};
  console.log(req.body);
  try {
    doc = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      doc,
    });
  } catch (err) {
       return(next(new AppError(err.message,404)))
  }
};

exports.updatePassword = async (req, res, next) => {
  //1) Get user from collection
  console.log(req.body);
  const user = await User.findById(req.user.id).select("+password");
  //2) check if posted password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    //return next(new AppError('Your current password is wrong', 401));
    console.log("wrong password");

    return(next(new AppError('wrong password',404)))

  }
  //3) if so ,Update the password
  user.password = req.body.newPassword;
  await user.save();
  //4) log user in,send JWT

  res.status(200).json({
    status: "success",
    doc: "password changed successfully",
  });
  
  next();
};

exports.deleteMe = async (req, res, next) => {
  console.log('deleting...');
  console.log(req.body);
  console.log('user'+req.user);
  try {
    if(!req.body.currentPassword) return(next(new AppError('password field cannot be empty!',400)))
    if (await req.user.correctPassword(req.body.currentPassword, req.user.password)) {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({
        status: "success",
      });
    }else{
      return(next(new AppError('Incorrect password',404)))
    }
  } catch (error) {
    return(next(new AppError(error.message,404)))
  }
};

exports.uploadProfilePhoto = (req, res, next) => {
  console.log(req.file);

  res.status(200).json({
    status: "success",
    file: req.file.filename,
  });
};
