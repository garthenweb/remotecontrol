import http from 'http';
import path from 'path';
import express from 'express';
import socketIO from 'socket.io';

export const app = express();
export const server = http.Server(app);

const io = socketIO(server);
export const sockets = io.sockets;

export default (port) => {
  app.use(express.static(path.join(__dirname, '..', '..', 'public')));
  server.listen(port);
};
