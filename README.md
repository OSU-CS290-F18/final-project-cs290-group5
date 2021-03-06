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
 - `username available` client->server
    - sends one param: username
 - `username check ret` server->client
    - sends one param: available (boolean)
 - `new user` client->server
    - sends one param: username
 - `new user connected` server->client
    - sends one param: username
 - `new message` client->server
    - sends two params: channel, msg
 - `new message incoming` server->client
    - sends three params: channel, username, msg
 - `channel available` client->server
    - sends one param: channel
 - `channel check ret` server->client
    - sends two params: channel, available (boolean)
 - `new channel` client<->server
    - both parties send one param: channel
 - `disconnect` client->server
    - sends no params
 - `user disconnected` server->client
    - sends one param: username
 - `db error` server->client
    - sends one param: msg
    - possible messages
      - `error initializing user`
      - `error adding channel`
      - `error storing msg`
      - `error removing user`
 - `switched channel` client->server
    - sends one param: channel
 - `old messages` server->client
    - sends array of json objects (ts, username, message)

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