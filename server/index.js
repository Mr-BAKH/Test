//👇🏻 index.js
const express = require("express");
const app = express();
const PORT = 4000;
const http = require("http").Server(app);
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "<http://192.168.77.100:4000>"
    }
});

let chatRooms = []
//👇🏻 Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("createRoom", (roomName) => {
        //👇🏻 Generates random string as the ID
        const generateID = () => Math.random().toString(36).substring(2, 10);

        socket.join(roomName);
        //👇🏻 Adds the new group name to the chat rooms array
        chatRooms.unshift({ id: generateID(), roomName, messages: [] });
        //👇🏻 Returns the updated chat rooms via another event
        socket.emit("roomsList", chatRooms);
    });

    socket.on("findRoom", (id) => {
        //👇🏻 Filters the array by the ID
        let result = chatRooms.filter((room) => room.id == id);
        //👇🏻 Sends the messages to the app
        socket.emit("foundRoom", result[0].messages);
    });

    socket.on("newMessage", (data) => {
        const generateID = () => Math.random().toString(36).substring(2, 10);
        //👇🏻 Destructures the property from the object
        const { room_id, message, user, timestamp } = data;
        console.log(room_id, message, user, timestamp)
    
        //👇🏻 Finds the room where the message was sent
        let result = chatRooms.filter((room) => room.id == room_id);
    
        //👇🏻 Create the data structure for the message
        const newMessage = {
            id: generateID(),
            text: message,
            user,
            time: `${timestamp.hour}:${timestamp.mins}`,
        };
        //👇🏻 Updates the chatroom messages
        socket.to(result[0].name).emit("roomMessage", newMessage);
        result[0].messages.push(newMessage);
    
        //👇🏻 Trigger the events to reflect the new changes
        socket.emit("roomsList", chatRooms);
        socket.emit("foundRoom", result[0].messages);
    });

    socket.on('disconnect', () => {
      socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});


app.get("/api", (req, res) => {
    res.json(chatRooms);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});