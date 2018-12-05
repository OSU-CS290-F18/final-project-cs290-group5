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

// Toggle a modal
function modalToggle(modal) {
    if (modal.style.display.indexOf("none") != -1) {
        // modal is currently visible
        // hide dat boi
        modal.style.display = "none";
        modalBackdrop.style.display = "none";
    } else {
        // modal is not currently visible
        // show dat boi
        modal.style.display = "block";
        modalBackdrop.style.display = "block";
    }
}

// Handler for setting username
newUserSubmit.addEventListener("click", () => {
    // get field value
    username = newUserField.value;
    newUserField.value = "";
    console.log(`got username: ${username}`);

    // close modal
    modalToggle(newUserModal);

    // broadcast
    socket.emit("new user", username);
});

// Handler for making a new channel
newChannelSubmit.addEventListener("click", () => {
    // get field value
    let newChannelName = newChannelField.value;
    newChannelField.value = "";
    console.log(`new channel made: ${newChannelName}`);

    // close modal
    modalToggle(newChannelModal);

    // broadcast
    socket.emit("new channel", newChannelName);
});

// Handler for cancelling the creation of a new channel
newChannelAbort.addEventListener("click", () => {
    // clear field
    newChannelField.value = "";

    // close modal
    modalToggle(newChannelModal);
});

