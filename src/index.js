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

//registering socket related configuration
io.on("connection", (socket) => {
    console.log('A New WebSocket Connection is Ensteblished');

    //when a user disconnect with server we want to capture

    socket.on('disconnect', () => {
        console.log("A User is Disconnected from The Server")
    })
});

const port = process.env.PORT || 3000
httpServer.listen(port, () => {
    console.log(`Server started @${port}`);
})