# Underline
_It's not Slack I swear..._

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