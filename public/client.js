// Vars for new user modal on page load
let newUserModal = document.getElementById("new-user-modal");
let newUserSubmit = document.getElementById("new-user-submit");
let newUserField = document.getElementById("new-user-field");

// Vars for new channel modal
let newChannelTrigger = document.getElementById("new-channel-trigger");
let newChannelModal = document.getElementById("new-channel-modal");
let newChannelSubmit = document.getElementById("new-channel-submit");
let newChannelAbort = document.getElementById("new-channel-abort");
let newChannelField = document.getElementById("new-channel-field");

// Modal vars
let modalBackdrop = document.getElementById("modal-backdrop");
let modalVisible = true;

// Vars for sending a message
let messageTextBox = document.getElementById("message-text-box");
let messageSend = document.getElementById("message-send");

// Vars for channel & message list
let channelList = document.getElementById("channels-list");
let messageList = document.getElementById("message-list");

// Socket.io handle
const socket = io();

// Data (both are strings)
let currentUsername, activeChannel;

// Clear all rendered messages
function clearMessages() {
    while (messageList.firstChild) {
        messageList.removeChild(messageList.firstChild);
    }
}

// Render new message
function renderMessage(user, msg) {
    var ts = new Date();
    let msgItem = document.createElement("li");
    msg = `${ts.toLocaleTimeString()}  ${msg}`;
    console.log(`rendering ${msg}`);
    msgItem.appendChild(document.createTextNode(msg));
    //TODO add proper attributes
    //TODO do something with the user, talk with Paulina
    messageList.appendChild(msgItem);

}

// Render status msg (i.e. user join, user leave)
function renderStatus(msg) {
    let msgItem = document.createElement("li");
    msgItem.appendChild(document.createTextNode(msg));
    //TODO add proper attributes
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
            channelsInList[i].classList.add("active");
        } else {
            channelsInList[i].classList.add("inactive");
        }
    }
    activeChannel = name;
    console.log(`active channel is now ${activeChannel}`);

    // remove all existing messages from the DOM
    clearMessages();
}

// Toggle a modal
function modalToggle(modal) {
    if (modalVisible) {
        console.log("hiding modal");
        // modal is currently visibles
        // hide dat boi
        modal.style.display = "none";
        modalBackdrop.style.display = "none";
    } else {
        console.log("showing modal");
        // modal is not currently visible
        // show dat boi
        modal.style.display = "block";
        modalBackdrop.style.display = "block";
    }
    modalVisible = !modalVisible;
}

// Handler for setting username
newUserSubmit.addEventListener("click", () => {
    // get field value
    currentUsername = newUserField.value;
    if (currentUsername == "") {
        alert("Please don't leave field blank");
        return;
    }
    newUserField.value = "";
    console.log(`got username: ${currentUsername}`);

    // validate
    socket.emit("username available", currentUsername);

    // rest of handler in socket.on("username check ret")
});

// Handler for displaying new channel modal
newChannelTrigger.addEventListener("click", () => {
    // toggle modal
    modalToggle(newChannelModal);
})

// Handler for making a new channel
newChannelSubmit.addEventListener("click", () => {
    // get field value
    let newChannelName = newChannelField.value;
    newChannelField.value = "";
    console.log(`new channel made: ${newChannelName}`);

    // validate
    socket.emit("channel available", newChannelName);

    // rest of handler in socket.on("channel check ret")
});

// Handler for cancelling the creation of a new channel
newChannelAbort.addEventListener("click", () => {
    // clear field
    newChannelField.value = "";

    // close modal
    modalToggle(newChannelModal);
});

// Handler for sending a new message
messageSend.addEventListener("click", () => {
    // get field value
    let msgText = messageTextBox.value;
    messageTextBox.value = "";
    console.log(`sending message: ${msgText}`);

    // broadcast
    socket.emit("new message", activeChannel, msgText);
});

// Send disconnect on window unload
window.addEventListener("beforeunload", () => {
    socket.emit("disconnect");
    console.log("beforeunload is fired");
});

// Finish handling setting the username when validation comes back
socket.on("username check ret", (available) => {
    if (available) {
        // close modal
        modalToggle(newUserModal);

        // broadcast
        socket.emit("new user", currentUsername);
    } else {
        alert("Username unavailable");
    }
});

// Finish handling creating a channel when validation comes back
socket.on("channel check ret", (available) => {
    if (available) {
        // render new channel
        addChannelToSidebar(newChannelName);    

        // close modal
        modalToggle(newChannelModal);

        // broadcast
        socket.emit("new channel", newChannelName);
    } else {
        alert("Channel name unavailable");
    }
});

// Show status when new user joins
socket.on("new user connected", (username) => {
    renderStatus(`new user connected: ${username}`);
});

// Show new message if it's in our channel
socket.on("new message incoming", (channel, username, msg) => {
    console.log("new message incoming");
    if (channel.valueOf() === activeChannel) {
        console.log("got message for active channel");
        renderMessage(username, msg);
    } else {
        console.log("got message for inactive channel");
    }
});

// Add a new channel
socket.on("new channel", (channel) => {
    addChannelToSidebar(channel);
    if (channel.valueOf() === "general") {
        console.log("received general channel from server");
        setActiveChannel(channel);
    }
});

// Show status when user leaves
socket.on("user disconnected", (username) => {
    renderStatus(`user disconnected: ${username}`);
});

// Watch for db errors
socket.on("db error", (msg) => {
    renderStatus(msg);
    console.error(msg);
});