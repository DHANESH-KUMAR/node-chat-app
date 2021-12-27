const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const Filter = require('bad-words');

//here we're creating http-server because Socket Server take httpPlane server
const httpServer = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(httpServer);



const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath))

app.get("/", (req, res) => {
    return res.sendFile("index.html");
})

let count = 0;

//registering socket related configuration
io.on("connection", (socket) => {
    console.log('A New WebSocket Connection is Establishing');

    socket.broadcast.emit("onWelcome", "Welcome!!");

    socket.emit("countValueUpdated", count);
    //when a user disconnect with server we want to capture


    socket.on("incrementCount", () => {
        count++;
        //line no 40 or below line emitting for specific connection or individual 
        // socket.emit("countValueUpdated", count);

        //we want to broadcast to all active connection there io object or global server for web-socket
        //with the help of IO we can emitting the event which treat as broadcast
        io.emit("countValueUpdated", count);
    });

    socket.on("CaptureSentMessage", (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback({ "isError": true, "message": "Profanity is not allowed!" });
        }

        io.emit("CaptureOnReceive", message);

        //here we're sending acknowledgement for client end
        callback({ "isError": false, "message": "Profanity is not allowed!" })
    });

    socket.on('disconnect', () => {
        console.log("A User is Disconnected from The Server");
    });

    //we are capturing shared location
    socket.on("ShareLocation", (position,callback) => {
        console.log(position)
        //below line we're sharing position to other available clients
        const location_URL = `https://google.com/maps?q=${position.latitude},${position.longitude}`
        socket.broadcast.emit("ReceivedOtherUserLocation", location_URL);
        callback('Shared');
    });
});

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
    console.log(`Server started @${port}`);
})