//initilize the socket in client-side!
const socket = io();


//capturing  or subscribing a particular EVENT which is Broadcasting from SERVER!
socket.on("countValueUpdated", (countValue) => {
    document.getElementById("countValue").innerText = countValue;
    //  console.log('The count has been updated !!', countValue);
})


document.getElementById("incrementCount").addEventListener("click", function (e) {
    e.preventDefault();
    socket.emit('incrementCount');
});

//when user got connected with server then we need to show some welcome message;

socket.on("onWelcome", (welcomeData) => {
    var msgContainer = document.getElementById("welcome-message-container");
    msgContainer.innerText = welcomeData
    setTimeout(() => {
        msgContainer.innerHTML = "";
    }, 1000)

});

//sending-messages
document.getElementById("form_simple_msg").onsubmit = function (e) {
    e.preventDefault();
    const message = e.target.elements.txtMessage.value;
    //message sent
    socket.emit("CaptureSentMessage", message, function (acknowledge) {

        if (acknowledge.isError) {
            console.warn(acknowledge.message);
        } else {
            console.log(acknowledge.message);
        }


    });
}

socket.on("CaptureOnReceive", (message) => {
    console.log(message);
});


document.getElementById("send-location").addEventListener("click", function (e) {
    e.preventDefault();

    //checking geolocation api supported this browser or not?
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser!!");
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        let coords = JSON.stringify(position.coords);
        // socket.emit("ShareLocation", `Location Lat:${position.coords.latitude} Long:${position.coords.longitude}`);
        socket.emit("ShareLocation",
            { latitude: position.coords.latitude, longitude: position.coords.longitude },
            function (ack) {
                console.log(ack);
            }
        );

    }, function (error) {
        console.log(error);
    })
});

socket.on("ReceivedOtherUserLocation", function (position) {
    console.log(position);
})