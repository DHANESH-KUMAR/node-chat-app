//initilize the socket in client-side!
const socket = io();


//capturing  or subscribing a particular EVENT which is Broadcasting from SERVER!
socket.on("countValueUpdated", (countValue) => {
    document.getElementById("countValue").innerText = countValue;
    //  console.log('The count has been updated !!', countValue);
})


document.getElementById("incrementCount").addEventListener("click", function(e) {
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

//sedning-messages
document.getElementById("form_simple_msg").onsubmit = function(e) {
    e.preventDefault();
    const message = e.target.elements.txtMessage.value;
    //message sent
    socket.emit("CaptureSentMessage", message);
}

socket.on("CaptureOnReceive", (message) => {
    console.log(message);
})