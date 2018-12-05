// Vars for new user modal on page load
let newUserModal = document.getElementById("new-user-modal");
let newUserSubmit = document.getElementById("new-user-submit");
let newUserField = document.getElementById("new-user-field");

// Vars for new channel modal
let newChannelModal = document.getElementById("new-channel-modal");
let newChannelSubmit = document.getElementById("new-channel-submit");
let newChannelAbort = document.getElementById("new-channel-abort");
let newChannelField = document.getElementById("new-channel-field");

// Modal backdrop var
let modalBackrdop = document.getElementById("modal-backdrop");

// Vars for sending a message
let messageTextBox = document.getElementById("message-text-box");
let messageSend = document.getElementById("message-send");

// Vars for channel & message list
let channelList = document.getElementById("channels-list");
let messageList = document.getElementById("message-list");

// Socket.io handle
const socket = io();

// Data (both are strings)
let username, activeChannel;

// Clear all rendered messages
function clearMessages() {
    while (messageList.firstChild) {
        messageList.removeChild(messageList.firstChild);
    }
}

// Render new message
function renderMessage(user, msg) {
    let msgItem = document.createElement("li");
    msgItem.appendChild(document.createTextNode(msg));
    //TODO add proper attributes
    //TODO do something with the user, talk with Paulina
    messageList.appendChild(msgItem);
}

// Render new channel in sidebar
function addChannelToSidebar(name) {
    let channelItem = document.createElement("li");
    channelItem.appendChild(document.createTextNode(name));
    //TODO add proper attributes
    channelList.appendChild(channelItem);
}

// Set active channel
function setActiveChannel(name) {
    // get element for new active channel in sidebar
    let channelsInList = channelList.getElementsByTagName("li");
    for (let i = 0; i < channelsInList.length; i++) {
        if (name === channelsInList[i].textContent.valueOf()) {
            // got new active channel
            //TODO do something with it
        } else {
            //TODO set channel not active in CSS
        }
    }
    activeChannel = name;
}

// Handler for setting username
newUserSubmit.addEventListener("click", () => {
    // get field value
    username = newUserField.value;
    console.log(`got username: ${username}`);

    // close modal
    
});

// OLD CODE

let sendButton = document.getElementById('send');
let message = document.getElementById("text-input");
let newUserButton = document.getElementById("new-user");
let startButton = document.getElementById("start");
let userName = document.getElementById("user-input");
let window = document.getElementById("chat-input");

newUserButton.addEventListener('click', () => {
    document.getElementById('backdrop').classList.toggle("hidden");
    document.getElementById('user-popup').classList.toggle("hidden");
});

startButton.addEventListener('click', () => {
    if (userName.value == "") {
        alert("Please enter username");
    } else {
        let popUpContainer = document.createElement("div");
        popUpContainer.classList.add("inside-popup");
        let userNameContainer = document.createElement("div");
        userNameContainer.textContent =  userName.value;
        userNameContainer.classList.add("username");
        popUpContainer.appendChild(userNameContainer);
        window.appendChild(popUpContainer);
        alert("new user added! ", userName.value);
        console.log(userName.value);
    }
    document.getElementById('backdrop').classList.toggle("hidden");
    document.getElementById('user-popup').classList.toggle("hidden");
});

sendButton.addEventListener('click', () => {
    let messageContainer = document.createElement('div');
    messageContainer.classList.add("chat-input");
    messageContainer.textContent = message.value;
    let messageContents = document.getElementsByClassName("chat-and-send");
    messageContents[0].appendChild(messageContainer);
    message.value = "";
}); 