const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Provide fullName"],
    },
    userName: {
      type: String,
      required: [true, "please tell us your name"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please provide your email"],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
      minlength: 8,
      select: false,
    },
    active: {
      type: Boolean,
      default: false,
      select: false,
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    passwordResetToken:{type:String},
    passwordResetExpires:Number,
    passwordModified:Date,
    posts: [{ type: mongoose.Schema.Types.ObjectId ,ref:'Post'}],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword,userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};



userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema,'users');

module.exports = User;
