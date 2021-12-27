const path = require("path");
const http = require("http");
const express = require("express");
const app = express();

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
    console.log('A New WebSocket Connection is Ensteblished');

    socket.emit("onWelcome", "Welcome!!");

    socket.emit("countValueUpdated", count);
    //when a user disconnect with server we want to capture


    socket.on("incrementCount", () => {
        count++;
        //line no 40 or below line emiting for specific connection or inividual 
        // socket.emit("countValueUpdated", count);

        //we want to broadcast to all active connection there io object or global server for web-socket
        //whith the help of IO we can emting the event which treat as broadcast
        io.emit("countValueUpdated", count);
    });

    socket.on("CaptureSentMessage", (message) => {
        io.emit("CaptureOnReceive", message);
    });

    socket.on('disconnect', () => {
        console.log("A User is Disconnected from The Server");
    });
});

const port = process.env.PORT || 3002
httpServer.listen(port, () => {
    console.log(`Server started @${port}`);
})