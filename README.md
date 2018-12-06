# Underline
_It's not Slack I swear..._

### HTML Element IDs
 - New user modal: `new-user-modal`
 - New user modal submit: `new-user-submit`
 - New user text box: `new-user-field`
 - New channel popup trigger: `new-channel-trigger`
 - New channel modal: `new-channel-modal`
 - New channel modal submit: `new-channel-submit`
 - New channel modal cancel: `new-channel-abort`
 - New channel text box: `new-channel-field`
 - Modal backdrop: `modal-backdrop`
 - Message text box: `message-text-box`
 - Message send button: `message-send`
 - Channel `ul`: `channels-list`
 - Message `ul`: `message-list`

### Socket.io design
 - `new user` client->server
    - sends one param: username
 - `new user connected` server->client
    - sends one param: username
 - `new message` client<->server
    - client sends two params: channel, msg
    - server sends three params: channel, username, msg
 - `new channel` client<->server
    - both parties send one param: channel
 - `disconnect` client->server
    - sends no params
 - `user disconnected` server->client
    - sends one param: username
 - `db error` server->client
    - sends one param: msg

### Database Design
 - table `channels`:
     - channel_id integer pkey
     - name text
 - table `users`:
     - user_id integer pkey
     - name text
     - active boolean
 - table `messages`:
     - message_id integer pkey
     - channel_id integer (channels.channel_id fkey)
     - user_id integer (users.user_id fkey)
     - message text