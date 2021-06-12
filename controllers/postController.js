const Post = require("../models/postModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/posts");
  },
  filename: function (req, file, cb) {
    cb(null, "post-" + req.user.id + Date.now() + ".jpg");
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

exports.uploadPostPhoto = upload.single("photo");

exports.createPost = async (req, res, next) => {
  //    const [user,postImage,postCaption,createdAt] =  req.body
  console.log("creating post");
  console.log(req.body);

  let doc;
  let user;
  let posts;
  try {
    //Creating new post
    doc = await Post.create(req.body);
    //getting user data to update
    user = await User.findById(req.body.author);
    posts = user.posts;
    posts.push(doc.id);
    //updating the post array in user collection
    updatedUser = await User.findByIdAndUpdate(req.body.author, { posts });
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
  res.status(201).json({
    status: "success",
    post: doc,
  });
};
exports.getAllPosts = async (req, res, next) => {
  console.log("getting posts");
  let posts = {};
  try {
    posts = await Post.find()
      .populate("author", "photo userName")
      .sort({ createdAt: -1 });
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
  res.status(200).json({
    status: "success",
    posts,
  });
};

exports.getPost = async (req, res, next) => {
  console.log("getting post", req.params.id);
  let doc = {};
  try {
    doc = await Post.findById(req.params.id).populate("author");
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
  res.status(200).json({
    status: "success",
    post: doc,
  });
};

exports.deletePost = async (req, res, next) => {
  console.log("deleting post..." + req.params.id);
  let doc = {};

  try {
    doc = await Post.findByIdAndDelete(req.params.id);
    user = await User.findById(req.user.id);
    let posts = user.posts;
    console.log(user.posts);

    var index = user.posts.indexOf(req.params.id);
    console.log(index);

    posts = user.posts.filter(post =>{
      console.log(post);
      return !(post+'' == req.params.id+'')
    })

    let updatedUser = await User.findByIdAndUpdate(req.body.author, { posts });

    console.log(updatedUser);

    // console.log(posts+' before filter');

    // let filteredPosts =  posts.filter(post => post._id !== req.params.id);

    // console.log(posts+' after delete');

    // let updatedUser = await User.findByIdAndUpdate(req.body.author, { filteredPosts });
    // console.log('updated user '+updatedUser);
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
  res.status(200).json({
    status: "success",
  });
};

exports.uploadFile = (req, res, next) => {
  console.log(req.file);

  res.status(200).json({
    status: "success",
    file: req.file.filename,
  });
};
