const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dbConnect = require('./config/dbConnect.js');
// const { errorHandler } = require('./middleware/errorHandler.js');


//load env
dotenv.config();

//connect db
dbConnect();

//create express app
const app = express();

//cors
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://diskors.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

//cookie parser
app.use(cookieParser());

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//session

//cron job


//routes
app.use('/api/user', require('./routes/auth/auth.js'));

//get routes
app.use('/api/get', require('./routes/get/topicFeed.js'));
app.use('/api/get', require('./routes/get/roomFeed.js'));
app.use('/api/get', require('./routes/get/room.js'));
app.use('/api/get', require('./routes/get/getChats.js'));
app.use('/api/get', require('./routes/get/getUser.js'));

//postroutes
app.use('/api', require('./routes/send/postChat.js'));
app.use('/api', require('./routes/send/createRoom.js'));
app.use('/api', require('./routes/send/deleteRoom.js'));
app.use('/api', require('./routes/send/deleteChat.js'));
app.use('/api', require('./routes/send/updateRoom.js'));
app.use('/api', require('./routes/send/profileUpdate.js'));


// error handler
// app.use(errorHandler);

// Set timeout
app.use((req, res, next) => {
    req.setTimeout(120000); // 2 minutes
    res.setTimeout(120000); // 2 minutes
    next();
});

//port
const port = process.env.PORT || 5000;

//start server
app.listen(port, ()=> {
    console.log(`Server started on port ${port}`)
});