const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
});


app.use('/peerjs',peerServer);

//Generating random room id
//Uuid is used for generating random id
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");

// Telling express js about public directory
app.use(express.static("public"));

//Redirects to the id generated
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId)=>{
        // console.log("joined the room");
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
        // Listen for message from client
        socket.on('message',message =>{
          io.to(roomId).emit('createMessage',message,userId)
        })
        socket.on('disconnect',() =>{
          socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})

server.listen(3030,()=> console.log(`Listening on port 3030`));
