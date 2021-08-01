const app = require('./app');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const cloudinary = require('cloudinary')
const port = 3000

dotenv.config({ path: './config.env' });

//DB CONNECT

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );

  // console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully!!'));

// connect cloudinary cloud storage
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
})

//SERVER

process.on('uncaughtException', err => {
  console.error('err : '+err)
})

app.listen(process.env.PORT || port,() => {
    console.log(`app running at port ${port}`)
})

