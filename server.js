const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dbConnect = require('./config/dbConnect.js');
const session = require("express-session");
const passport = require('./utils/passport.js');
const MongoStore = require('connect-mongo');
// const { errorHandler } = require('./middleware/errorHandler.js');
const User = require('./models/user.js');

// Create Express app
const app = express();

// Load environment variables


const corsObject = {
  origin: [process.env.LOCAL, process.env.LIVE],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}

// For Socket.IO
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: corsObject,
  pingInterval: 25000,
  pingTimeout: 5000
});

// Connect to the database
dbConnect();

// Set up CORS middleware
app.use(cors(corsObject));

//session
app.use(
  session({
    secret: process.env.REFRESH_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_STRING, // MongoDB connection string
      collectionName: 'sessions', // name of the collection to store sessions
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // Session expiration 7 days
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


let onlineUsers = new Set();

// Set up Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    /*** 🔹 USER ONLINE TRACKING ***/
    socket.on("userOnline", (userId) => {
      socket.userId = userId; // Store userId in socket
      if (!onlineUsers.has(userId)) {
          onlineUsers.add(userId);
          io.emit("onlineUsers", Array.from(onlineUsers));
      }
    });

    socket.on("userOffline", (userId) => {
        onlineUsers.delete(userId);
        io.emit("onlineUsers", Array.from(onlineUsers));
    });

    /*** 🔹 REAL-TIME CHAT FUNCTIONALITY ***/
    socket.on('join_room', (roomId) => {
      socket.join(roomId);      
    });
  
    socket.on('send_message', async (data) => {
    try {
        // Assuming data.sender is an ObjectId, fetch the complete sender details from the database
        const sender = await User.findById(data.sender).select('_id username profilePicture');

        if (!sender) {
          throw new Error('Sender not found');
        }

        const message = {
        _id: data._id,
        sender: sender,  // Use the complete sender details fetched from the database
        text: data.text,
        createdAt: data.createdAt,
        };

        // console.log(`Message sent to room: ${data.roomId}`, message);
        io.to(data.roomId).emit('receive_message', message);
    } catch (error) {
        console.error('Error fetching sender details:', error);
      }
    });
  
    socket.on('delete_message', (data) => {
      io.to(data.roomId).emit('delete_message', data);
      console.log(`Message ${data.chatId} deleted in room:`, data.roomId);
    });
  
    /*** 🔹 HANDLE DISCONNECT ***/
    socket.on("disconnect", () => {
      if (socket.userId) {
          onlineUsers.delete(socket.userId);
          io.emit("onlineUsers", Array.from(onlineUsers));
      }
      console.log("Client disconnected");
    });
});


//cookie parser
app.use(cookieParser());

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//cron job

//routes
app.use('/auth', require('./routes/auth/socials.js'));
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


//port
const port = process.env.PORT || 5000;

//start server
server.listen(port, ()=> {
    console.log(`Server started on port ${port}`)
});