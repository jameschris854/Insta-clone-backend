const app = require('./app');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
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

//SERVER

process.on('uncaughtException', err => {
  console.error('err'+err.message)
})

app.listen(process.env.PORT || port,() => {
    console.log(`app running at port ${port}`)
})

