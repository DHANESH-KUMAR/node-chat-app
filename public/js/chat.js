(function () {
    //initialize the socket in client-side!
    const socket = io();
    var $messageForm = document.getElementById("form_simple_msg");
    var $messageFormInput = $messageForm.querySelector("#txtMessage");
    var $messageFormButton = $messageForm.querySelector("button");
    var $shareLocation = document.getElementById("send-location");

    //container of all messages
    var $messages = document.getElementById("messages");
    var $messageTemplate = document.querySelector("#message-template").innerHTML;
    var $locationTemplate = document.querySelector("#location-template").innerHTML;

    //query options
    const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


    //when any new User Connect show information
    socket.on("RECEIVE_WelcomeMessage", (info) => {
        var html = Mustache.render($messageTemplate, { message: info.text, createdOn: moment(info.createdOn).format("h:MM a") });
        $messages.insertAdjacentHTML("beforeend", html);
    });

    //sending-messages
    $messageForm.addEventListener("submit", function (e) {
        e.preventDefault();
        $messageFormButton.setAttribute("disabled", "disabled");
        //message sent
        socket.emit("SEND_MessageToServer", $messageFormInput.value, function (acknowledge) {
            if (acknowledge.isError) {
                console.warn(acknowledge.message);
            } else {
                console.log(acknowledge.message);
                $messageFormButton.removeAttribute("disabled");
                $messageFormInput.value = "";
                $messageFormInput.focus();
            }
        });
    });

    socket.on("RECEIVE_MessageFromServer", (info) => {
        const html = Mustache.render($messageTemplate, {
            message: info.text, createdOn: moment(info.createdOn).format("h:MM a")
        });
        $messages.insertAdjacentHTML("beforeend", html);
    });

    $shareLocation.addEventListener("click", function (e) {
        e.preventDefault();
        //checking geolocation api supported this browser or not?
        if (!navigator.geolocation) {
            return alert("Geolocation not supported by your browser!!");
        }

        navigator.geolocation.getCurrentPosition(function (position) {
            // socket.emit("ShareLocation", `Location Lat:${position.coords.latitude} Long:${position.coords.longitude}`);
            $shareLocation.setAttribute("disabled", "disabled")
            //Sending or Emitting Event to Server
            socket.emit("SEND_LocationToServer",
                { latitude: position.coords.latitude, longitude: position.coords.longitude },
                function (ack) {
                    console.log(ack);
                    $shareLocation.removeAttribute("disabled");
                }
            );
        }, function (error) {
            console.log(error);
        })
    });

    //Receiving location from the server
    socket.on("RECEIVE_LocationFromServer", function (info) {
        var html = Mustache.render($locationTemplate, {
            locationUrl: info.URL,
            createdOn: moment(info.createdOn).format("h:MM a")
        });
        $messages.insertAdjacentHTML("beforeend", html);

    });

    socket.emit("SEND_join", { username, room }, function (ack) {
        console.log(ack);
    });
})();