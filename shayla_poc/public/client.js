
var sendButton = document.getElementById('send');
var message = document.getElementById("text-input");
var newUserButton = document.getElementById("new-user");
var startButton = document.getElementById("start");
var userName = document.getElementById("user-input");
var window = document.getElementById("chat-input");
var body = document.body;
//var newChannelButton = document.getElementById()
//var userName = document.getElementById("user-input");
/* var chat = io.of('chat');
var user = io.of('users');
var channel = io.of('channels'); */
//document.getElementById('backdrop').classList.toggle("hidden");
body.addEventListener('click', ()=>
{
    document.getElementById('popup').classList.add("hidden");
    document.getElementById('user-popup').classList.add("hidden");
});
newUserButton.addEventListener('click', ()=>
{
    //popup.style.display = "block";
    document.getElementById('popup').classList.remove("hidden");
    document.getElementById('user-popup').classList.remove("hidden"); 
});

startButton.addEventListener('click', ()=>
{
    if(userName.value = ""){
        alert("Please enter username");
    }else{
        
        var popUpContainer = document.createElement("div");
        popUpContainer.classList.add("inside-popup");
        var userNameContainer = document.createElement("div");
        userNameContainer.textContent =  userName.value;
        userNameContainer.classList.add("username");
        popUpContainer.appendChild(userNameContainer);
        //window.appendChild(popUpContainer);
        alert("new user added! ", userName.value);
        console.log(userName.value);
    }

    document.getElementById('backdrop').classList.toggle("hidden");
    document.getElementById('user-popup').classList.toggle("hidden");

});



sendButton.addEventListener('click', ()=>
{
    var messageContainer = document.createElement('div');
    messageContainer.classList.add("chat-input");
    messageContainer.textContent = message.value;
    var messageContents = document.getElementsByClassName("chat-and-send");
    messageContents[0].appendChild(messageContainer);
    message.value = "";
}); 

