const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require("./utils/messages");


//here we're creating http-server because Socket Server take httpPlane server
const httpServer = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(httpServer);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath))

app.get("/", (req, res) => {
    return res.sendFile("index.html");
})


//registering socket related configuration
io.on("connection", (socket) => {
    console.log('A New WebSocket Connection is Establishing');

    socket.on("SEND_join", ({ username, room }) => {

        socket.join(room);

        //broadcasting to other connected user
        socket.emit("RECEIVE_WelcomeMessage", generateMessage("Welcome!!"));
        socket.broadcast.to(room).emit("RECEIVE_MessageFromServer", generateMessage(`${username} has joined!`));

        //socket.emit,io.emit,socket.broadcast.emit
        //io.to.emit,socket.broadcast.to.emit
    });


    //here we are capturing Event Sent By client
    socket.on("SEND_MessageToServer", (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback({ "isError": true, "message": "Profanity is not allowed!" });
        }

        //broadcasting to all include ourself
        io.emit("RECEIVE_MessageFromServer", generateMessage(message));

        //here we're sending acknowledgement for client end
        callback({ "isError": false, "message": "Profanity is not allowed!" })
    });

    socket.on('disconnect', () => {
        console.log("A User is Disconnected from The Server");
    });

    //we are capturing shared location
    socket.on("SEND_LocationToServer", (position, callback) => {
        //below line we're sharing position to other available clients
        const location_URL = `https://google.com/maps?q=${position.latitude},${position.longitude}`

        //broadcasting location to Other Users
        io.emit("RECEIVE_LocationFromServer", generateLocationMessage(location_URL));
        callback('Shared');
    });

});

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
    console.log(`Server started @${port}`);
})