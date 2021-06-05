const Post = require("../models/postModel");
const User = require("../models/userModel");

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
    doc = err.message;
  }
  res.status(200).json({
    post:doc
  });
};
exports.getAllPosts = async (req, res, next) => {
  console.log("getting posts");
  let posts = {};
  try {
    posts = await Post.find().populate("author", "photo userName").sort({ 'createdAt' : -1});
  } catch (err) {
    posts = err.message;
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
    doc = err.message;
  }
  res.status(200).json({
    status: "success",
    post: doc,
  });
};

exports.deletePost = async (req, res, next) => {
  console.log("deleting...");
  let doc = {};
  try {
    doc = await Post.findByIdAndDelete(req.params.id);
  } catch (err) {
    doc = err.message;
  }
  res.status(201).json({
    status: "success",
  });
};
