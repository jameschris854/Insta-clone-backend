const Post = require("../models/postModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

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
    return(next(new AppError(err.message,404)))
  }
  res.status(201).json({
    status:'success',
    post:doc
  });
};
exports.getAllPosts = async (req, res, next) => {
  console.log("getting posts");
  let posts = {};
  try {
    posts = await Post.find().populate("author", "photo userName").sort({ 'createdAt' : -1});
  } catch (err) {
    return(next(new AppError(err.message,404)))
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
    return(next(new AppError(err.message,404)))
  }
  res.status(200).json({
    status: "success",
    post: doc,
  });
};

exports.deletePost = async (req, res, next) => {
  console.log("deleting post...");
  let doc = {};
  try {
    doc = await Post.findByIdAndDelete(req.params.id);
    user = await User.findById(req.user.id);
    posts = user.posts;
    posts.filter(post => post.id !== req.params.id);
  } catch (err) {
    return(next(new AppError(err.message,404)))
  }
  res.status(200).json({
    status: "success",
  });
};
