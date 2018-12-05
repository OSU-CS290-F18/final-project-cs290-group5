let socket = io();

let button = document.getElementById("send");
let m = document.getElementById("m");
button.addEventListener("click", function(){
    console.log("sending msg:", m.value);
    socket.emit('chat message', m.value);
    m.value = "";
    return false;
});

let messages = document.getElementById("messages");
socket.on('chat message', function(msg){
    console.log("received msg:", msg);
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    messages.append(li);
    window.scrollTo(0, document.body.scrollHeight);
});