const express = require('express')
const userRouter = require('./Routes/userRoutes')
const cors = require('cors')
const postRouter = require('./Routes/postRoutes')
const app = express()


app.use(cors())

// app.use(express.json({
//   type: ['application/json', 'text/plain']
// }))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/',(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
     
    console.log('hit');
    res.send('hello world')
})

//ROUTES
app.use('/api/v1/users',userRouter)
app.use('/api/v1/posts',postRouter)

app.all('*',(req,res,next)=>{
    res.send('error 404 page not found')
})


module.exports = app;



































