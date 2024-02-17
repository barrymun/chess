import { Server, Socket } from "socket.io";

let io: Server | null = null;
let socket: Socket | null = null;

export const setIo = (newIo: Server) => {
  io = newIo;
};

export const getIo = () => {
  return io;
};

export const setSocket = (newSocket: Socket) => {
  socket = newSocket;
};

export const getSocket = () => {
  return socket;
};
