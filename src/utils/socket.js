import { io } from "socket.io-client";
// this code for connection bettween the client and server;
// const socket = io.connect("http://192.168.77.100:4000");
const ip = '192.168.77.100' //

// this code return a call back if user connect!
// const socketconnect = io.connect(`http://${ip}:4000`);
const socket = io(`http://${ip}:4000`);
export default socket;