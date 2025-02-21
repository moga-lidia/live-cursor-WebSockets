import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';

const server = http.createServer();
const wsServer = new WebSocketServer( {server} );
const port = 8000;

const connections = {};
const users = {};

const  broadcastUsers = () => {
   Object.keys(connections).forEach(uuid => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
   })
}

const handleMessage = (bytes, uuid) => {
  // client message = {"x" :0, "y": 0} 
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;

  broadcastUsers();

  console.log(message);
}

const handleClose = uuid => {
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];

  broadcastUsers();
}

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(username, uuid);

  connections[uuid] = connection;

  users[uuid] = {
    username: username,
    state: {
      // x: 0,
      // y: 0 
    },
  };

  connection.on("message", message => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));

})

server.listen(port, () => {
    console.log(`Server listens on port: ${port}`);
})