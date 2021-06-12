const express = require("express");
const userRouter = require("./Routes/userRoutes");
const cors = require("cors");
const postRouter = require("./Routes/postRoutes");
const app = express();
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const path = require('path')


app.use(express.static(`${__dirname}/public`));

app.use(cors());
// app.use(express.json({
//   type: ['application/json', 'text/plain']
// }))
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// app.get("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   console.log("hit");
//   res.send("hello world");
// });


//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});


app.use(globalErrorHandler);

module.exports = app;
